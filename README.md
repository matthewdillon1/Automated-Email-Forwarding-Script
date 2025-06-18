# Automated Email Forwarding Script
#### Author: Matthew Dillon
#### Last Edited: 2025-06-17

---

## Table of Contents
- [Purpose](#purpose)
- [Background](#background)
- [Project Relevance to Data Science](#project-relevance-to-data-science)
- [Project Constraints](#project-constraints)
- [Tools Leveraged](#tools-leveraged)
- [Basic Solution Description](#basic-solution-description)
- [Features](#features)
- [Detailed Script Methodology](#detailed-script-methodology)
- [Triggers](#triggers)
- [Script Requirements](#script-requirements)
- [Customization](#customization)
- [Personal Deployment Results](#personal-deployment-results)
- [Future Enhancements](#future-enhancements)
- [Links](#links)
  
---

## Purpose
This project was developed to automatically preserve historic Gmail threads from deletion under a new corporate email retention policy. It leverages Google Apps Script as an automated solution to maintain long-term email record-keeping for personal or professional use.


## Background
In early 2024, the corporate overlords of the company I was working for at the time sent a notification to all 300,000+ employees that a new email retention policy would go into effect on April 21, 2024. This new policy would delete all email threads older than 365 days, and would continue to do so on a rolling basis in perpetuity. I did not feel that this policy was fair to employees like myself who, albeit infrequently, rely on information memorialized in historic email threads. Furthermore, I felt that this policy is even more outrageous to subsets of the corporation such as legal teams, financial teams, and C-suite employees who will surely have very important documentation saved in the archives of their email inbox.

In a blatant act of corporate disobedience, I decided to leverage my data science and data analytics skill set/toolbox to develop a solution to what I viewed as an unreasonable decision from corporate. In a perfect world, I would be empowered and encouraged to publish and disseminate my solution to any and all employees who do not want to lose access to their historic email threads, but at the very least I hoped that I could leverage my solution for my own personal inbox.


## Project Relevance to Data Science
While this project doesn't leverage traditional ML/AI techniques that are usually synonymous with data science, it exemplifies many of the core tenets of data science such as:
- Automation via programming (JavaScript in Google Apps Script)
- Leveraging APIs to connect data sources
- Designing and implementing self-sufficient workflows
- Demonstrating creative solutioning and problem-solving within the confines of data and environmental constraints


## Project Constraints
The only major constraint that this project faced was the fact that our corporate overlords were pushing all Google products, and as a result the entire organization uses Gmail. Therefore, my solution would need to be able to integrate with Gmail and unfortunately would not be applicable to Outlook users.


## Tools Leveraged
After researching and comparing a number of different potential tools that could be leveraged to develop a solution, I ultimately decided to pursue a solution in Google Apps Scripts. Google Apps Scripts (GAS) is Google's application development platform that allows any user with a Google account to create robust scripts in JavaScript programming to automate processes and create streamlined workflows. GAS has the incredibly powerful ability to integrate with the entirety of the Google Workspace products via individual APIs, meaning that users' scripts can seamlessly interact with Gmail, Google Drive, Google Sheets, Google Forms, Google Calendar, Google Docs, etc. etc.


## Basic Solution Description
At a high level, my GAS code will identify email threads that are at risk of deletion and automatically forward the email back to the user's email address to "reset the clock" to prevent deletion. The script will also apply steps to mark the forwarded email as "read" and archive it out of the inbox. With this functionality as well as a daily trigger set for an early morning hour, the script performs seamlessly in the background without the need for human intervention, all the while keeping the user's inbox free of historic email clutter.


## Features
- Automatically identifies and forwards email threads at risk of deletion back to the user
- Specifically ignores email threads in Trash, Sent, Spam, Drafts, etc.
- Resets the "age" of the email thread to avoid deletion
- Leverages triggers to run automatically on a daily basis without human intervention
- Marks forwarded emails as "read" and archives them out of the user's inbox
- Organizes threads using the user's custom Gmail labels or automatically generating new labels


## Detailed Script Methodology
My GAS script begins by connecting to the Gmail account associated with the current script user. If there are multiple email addresses associated with this one account (as is the case with my work account), only the first email address located will be used - this will be the "send to" and "receive from" email address. The script will then iterate via pagination through the user's email threads in their inbox and/or in their custom labels - importantly, the script will purposefully exclude threads and messages located in the Sent, Trash, Spam, Draft, Scheduled, Social, and Promotions labels. 

For each qualifying email thread, the script will calculate the number of days that have elapsed since the most recent email message on the thread was either sent or received. If the most recent message is fewer than 363 days old, the script will do nothing and will iterate to the next thread. If the most recent message is greater than or equal to 363 days old (allowing for a two-day buffer before automated deletion), the email thread will then be automatically forwarded back *to* the user's account *from* the user's account - think of this as forwarding an email to yourself. This will essentially "reset the clock" and prevent the entire email thread from being automatically deleted pursuant to the new corporate policy.

Once an email thread has been forwarded back to the user, two additional steps are taken to streamline the process. Firstly, the forwarded email message will be marked as "read" so that the user will not be notified of the message. Secondly, the entire email thread will be archived out of the user's inbox via labels. If the email thread has a pre-existing label(s) associated with it, the thread will then be moved from the inbox to all applicable custom email labels. If the email thread does not have any pre-existing label(s) associated with it, the thread will be moved to a "catch-all" label of the year in which the most recent email message was sent. For example, if the most recent email message on the thread was sent in 2022, the entire thread will be moved out of the inbox and into a "2022" label. If the corresponding year label does not exist, the script will automatically create the label.


## Triggers
Once the script was complete, I further leveraged GAS's trigger function to set a daily trigger for this script to automatically run. I personally chose for the script to run between the hours of 2:00-3:00am MST to ensure I will not be actively sending emails during its execution. The use of a trigger allows this script to be self-sufficient, automatically saving all qualifying email threads from deletion in the background without the requirement of any human intervention once deployed.


## Script Requirements
The requirements to leverage this script on your own account are as follows:
1. Active Google account
2. Google Apps Script Gmail API (Editor > Services > Gmail API > Add)
3. Trigger (Triggers > Add Trigger > ...)
4. Authorization (allows the script to interact with your Gmail account via the Gmail API; only required the first time the script is run)

To leverage this script for personal use, navigate to [Google Apps Script](https://script.google.com/home), create a new project, and copy/paste the attached GAS script. Script customization is discussed below.


## Customization
The script has been configured such that it extracts the email address associated with the user's Google account, therefore manually specifying the email address to use is not necessary. The methodology I developed for archiving the forwarded email threads out of my inbox and into labels is very customized for my personal usage, therefore this can be altered in the code to fit the specific needs of the user.

## Personal Deployment Results
Once the script was finalized, I showed the code and the process to my director at the company to advertise the solution I had developed to circumvent the new corporate email retention policy. While he was very impressed with the abilities with the script, he was adamant that it could not be disseminated on a large scale because it is blatantly against the policy (again, this is an exercise in corporate disobedience). Nonetheless, I decided to deploy the script on my personal email account to the envy of many of my teammates and colleagues.

At the time of writing this document, the script has automatically run every morning for over 425 consecutive days straight with a 0% error rate. The script has never failed to function since deployment and has saved approximately 600 email threads to date from deletion, and has come in handy many times when I have needed to refer back to old threads that would have otherwise been deleted.


## Future Enhancements
While I do not plan on enhancing this script any further because it fits my needs perfectly, here are some ways in which the script could be enhanced in future versions:
1. Create an actual script deployment so that the script does not need to be copied/pasted into a user's personal GAS project to function
2. Incorporate text analytics so that custom labels can be created and/or applied based on the content of the email thread
3. Improve the current structure of applying and creating labels such that it is easier for other users to customize based on individualized needs
4. Change the 363 day mark into a parameter that the user can more easily specify at the beginning of the script
5. Allow the user to custom-filter which email threads should be forwarded (example: only forward emails if any message on the thread is from persons A, B, or C)

---

## Links
[Github repository link](https://github.com/matthewdillon1/Automated-Email-Forwarding-Script)

[automated-email-forwarding-script.js](https://github.com/matthewdillon1/Automated-Email-Forwarding-Script/blob/main/automated-email-forwarding-script.js)
