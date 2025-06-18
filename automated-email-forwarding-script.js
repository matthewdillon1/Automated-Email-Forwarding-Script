/* Automated Email Forwarding
Author: Matthew Dillon (https://github.com/matthewdillon1)
Last Edited: 04/16/2024

This Google Apps Script has been written to automatically forward "all" emails in a user's gmail account that are about to expire back into their gmail account. The script has been written in response to a new email retention policy being pushed by corporate that, beginning on April 21, 2024, will delete all emails threads older than 365 days on a rolling basis. "All" emails excludes the following categories:

 1) Sent emails
 2) Emails in the trash
 3) Emails marked as spam
 4) Email drafts
 5) Scheduled emails
 6) Emails automatically categorized as "Social"
 7) Emails automatically categorized as "Promotions"

At a high level, this script will connect to the user's gmail account via the Gmail API. Once connection is successful, the script will iterate through all email threads that meet the aforementioned criteria in reverse chronological order. Within each email thread, the script will extract the most recent (last) message in the thread. The script will then calculate how many days have elapsed since the email thread has been active. If the most recent message on the thread was sent 363 days ago (allowing 2 days for buffer), then this message (and hence the entire thread) will then be forwarded back to the user's email address, and will then be marked as read. Finally, the forwarded email will be archived to the appropriate label to avoid cluttering the user's inbox. If the email thread already has a predetermined label(s), the email thread will persist there. If no label is found, the email thread will be moved into a label of the year of the most recent message (the corresponding label will be created if it does not yet exist).

Please note that the maximum number of emails that can be sent via the Google API per day for an enterprise account is 2,000. As this script is primarily written for personal use, I have not implemented any fail-safe for this limit. I doubt this would be an issue, as 2,000 emails expiring on the same day is infinitesimally unlikely for any reasonable email stweard.

This is the second of two scripts that has been written to automate the process of saving emails from permanent deletion. The first script allowed the user to do a one-time bulk forwarding of emails for a specified timeframe.

This script has been triggered to run daily between  2:00-3:00am MST. */

function forwardEmailsAboutToExpire() {

  /* Step 1: Extract all of the email addresses associated with this Google account.
  For example, my Google account has three distinct email addresses all corresponding to my one account.*/

  var accountEmailAddresses = Gmail.Users.Settings.SendAs.list("me").sendAs; // Create an array of all "Send As" email address information found in this account
  var listOfUserEmailAddresses = [];                                         // Create an empty array to load the actual email addresses into

  // Iterate through all of the "Send As" email address information and add each email address to the listOfUserEmailAddresses variable
  for (var z = 0; z < accountEmailAddresses.length; z++) {
    listOfUserEmailAddresses.push(accountEmailAddresses[z].sendAsEmail);
  }

  // Test to ensure that all pertinent email addresses were located
  Logger.log('Email addresses found: ' + listOfUserEmailAddresses)

  var forwardEmailAddress = listOfUserEmailAddresses[0]                      // Extract the first email address from the listOfUserEmailAddresses to forward emails to
  Logger.log('Email address that emails will be forwarded to: ' + forwardEmailAddress)


  /* Step 2: Extract all email threads from the inbox.*/

  /* BEGIN PAGINATION */

  var pageToken;     // Instantiate a variable to hold the unique page tokens for the pagination function above
  var threads = [];  // Empty array to eventually hold information on the email threads pulled'

  // Function to paginate the results -- This allows the script to circumvent the 500 thread limit per each individual API call
  do {
    var threadsPage = Gmail.Users.Threads.list("me", {

      // This query line excludes miscellaneous categories of emails such as threads that are in sent, in the trash, are labeled as spam, etc.
      // Generally, only emails that are in the inbox or archived into one or multiple labels will be identified
      q: '-in:sent -in:trash -label:spam -label:draft -is:scheduled -category:social -category:promotions',

      maxResults: 100, // The maxResults variable can be adjusted as needed, though 100 seems to be best practice for computational efficiency
      pageToken: pageToken
    });
 
    // Iteratively add the email threads to the threads variable and move onto the next page token
    threads = threads.concat(threadsPage.threads);
    pageToken = threadsPage.nextPageToken;

    // Perform the above pagination function ONLY WHILE there is a page token in use
    // The page tokens will stop generating once the last email threads have been queried, which will trigger an exit from the do loop above
  } while (pageToken);

  // Count the total number of threads identified in the gmail account and add the count to the Log for script confirmation purposes
  if (threads) {
    Logger.log('Total email threads found: ' + threads.length)
  }


  /* Step 3: Iteratively extract the most recent email message on each thread and determine if the email thread will be forwarded. */

  // Create a variable to iteratively count the number of emails that fit the desired criteria to be forwarded
  // This will be used much later in the code, but needs to be instantiated outside of the below for loop
  var countOfEmailsForwarded = 0

  // Iterate through each email thread found in the user's gmail account
  for (var i = threads.length - 1; i >= 0; i--) {

    var thread = threads[i];     // Select the next thread
    var threadID = thread.id;    // Extract the corresponding ID of this thread

    // Extract all of the labels associated with the email thread, if applicable, and add them to a list
    var labels = GmailApp.getThreadById(threadID).getLabels().map(function(label) {
      return label.getName();
    })

    // Create a messages variable to extract all of the messages within the corresponding thread
    var messages = GmailApp.getThreadById(threadID).getMessages();

    // Extract only the most recent (last) message from the thread
    var message = messages[messages.length - 1];

    // Extract today's date as a date/time variable (automatically in the correct GMT timezone)
    var today = new Date()

    // Extract pertinent information the email message
    var sender = message.getFrom();                        // Extract the sender
    var subject = message.getSubject();                    // Extract the subject
    var body = message.getPlainBody();                     // Extract the message
    var sentDate = message.getDate();                      // Extract the date

    // Calculate the # of days elapsed from today to when the email thread in question was received
    // This date difference calculation defaults to the number of milliseconds elapsed, hence the division by (# hours/day * #seconds/hour * # milliseconds/second)
    // We then use the Math.ceil function to always round down, so that every email sent on the same day will have the same value
    var daysElapsed = Math.ceil((today - sentDate) / (24*3600*1000))

    // Check if the most recent email message is 363 days old
    if (daysElapsed === 363) {


      /* Step 4: Forward qualifying email threads back to self. */

      Logger.log('Email currently being forwarded: ' + subject + " - Sent Date: " + sentDate)

      // Forward the selected email back to the user's email address
      message.forward(forwardEmailAddress);               // Forward the email


      /* Step 5: Apply the relevant labels to the email thread and archive the email so that it will not reappear in the user's inbox. */

      // Case when the email thread has preexisting label(s)
      if (labels.length > 0) {

        var threadOfMessage = GmailApp.getThreadById(threadID);                   // Extract the email thread of the message
        threadOfMessage.moveToArchive();                                          // Remove the email from the user's inbox
        threadOfMessage.markRead();                                               // Mark the email as read

      // Case when the email thread does NOT have any preexisting label(s) applied
      } else {

        var yearMessageWasSent = new Date(sentDate).getFullYear().toString();     // Extract a string of the year that the email most recent email message was sent
        var doesYearLabelExist = GmailApp.getUserLabelByName(yearMessageWasSent); // Create a variable to test if this year label already exists or not


        // Case when the year label already exists in the user's gmail account
        if (doesYearLabelExist) {

          var threadOfMessage = GmailApp.getThreadById(threadID);                 // Extract the email thread of the message
          doesYearLabelExist.addToThread(threadOfMessage);                        // Add the year label to the thread
          threadOfMessage.moveToArchive();                                        // Remove the email from the user's inbox
          threadOfMessage.markRead();                                             // Mark the email as read
       
        // Case when the year label does NOT already exist in the user's gmail account
        } else {

          var newYearLabel = GmailApp.createLabel(yearMessageWasSent);            // Create the new year label
          var threadOfMessage = GmailApp.getThreadById(threadID);                 // Extract the email thread of the message
          newYearLabel.addToThread(threadOfMessage);                              // Apply the new label to the thread of the message
          threadOfMessage.moveToArchive();                                        // Remove the email from the user's inbox
          threadOfMessage.markRead();                                             // Mark the email as read
        }
      }

      // Add 1 to the forwarded email counter
      countOfEmailsForwarded += 1
    }

    // If the email does not meet the above criteria (i.e. is not about to expire), continue to the next email thread up in the iteration
    else {
      continue
    }
  }

  /* Step 6: Relay to the user the number of email that have been forwarded. */

  // Logger message for when at least one email has been forwarded
  if (countOfEmailsForwarded > 0) {
    Logger.log('The script is now complete. Total Emails Forwarded: ' + countOfEmailsForwarded)
  }

  else {
    Logger.log('Zero emails identified that are about to expire. No emails were forwarded. The script is now complete.')
  }
}