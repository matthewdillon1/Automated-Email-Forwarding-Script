# Automated Email Forwarding Script
#### Author: Matthew Dillon
#### Last Edited: 2025-06-14


## Background
In early 2024, the corporate overlords of the company I was working for at the time sent a notification to all 300,000+ employees that a new email retention policy would go into effect on April 21, 2024. This new policy would delete all email threads older than 365 days, and would continue to do so on a rolling basis in perpetuity. I did not feel that this policy was fair to employees like myself who, albeit infrequently, rely on information memorialized in historic email threads. Furthermore, I felt that this policy is even more outrageous to subsets of the corporation such as legal teams, financial teams, and C-suite employees who will surely have very important documentation saved in the archives of their email inbox.

In a blatant act of corporate disobedience, I decided to leverage my data science and data analytics skillset/toolbox to develop a solution to what I viewed as an unreasonable decision from corporate. In a perfect world, I would be empowered ane encouraged to publish and disseminate my solution to any and all employees who do not want to lose access to their historic email threads, but at the very least I hoped that I could leverage my solution for my own personal inbox.

## Project Constraints
The only major constraint that this project faced was the fact that our corporate overlords were pushing all Google products, and as a result the entire organization uses Gmail. Therefore, my solution would need to be able to integrate with Gmail and unfortunately would not be applicable to Outlook users.

## Tools Leveraged
After researching and comparing a number of different potential tools that could be leveraged to develop a solution, I ultimately decided to pursue a solution in Google Apps Scripts. Google Apps Scripts (GAS) is Google's application development platform that allows any user with a Google account to create robust scripts in JavaScript programming to automate processes and create streamlined workflows. GAS has the incredibly powerful ability to integrate with the entirety of the Google Workspace products via individual APIs, meaning that users' scripts can seamlessly interact with Gmail, Google Drive, Google Sheets, Google Forms, Google Calendar, Google Docs, etc. etc.

## Basic Solution Description
At a high level, my GAS code will iterate through the user's inbox/labels and calculate the number of days that have elapsed since the most recent email message on an email thread has been either sent or received. If the most recent email message is greater than 363 days (allowing for a two-day buffer before automated deletion), the email will then automatically be forwarded to the user's account from the user's account - think of this as forwarding an email to yourself. The script will also apply steps to mark the forwarded email as "read" and archive it out of the inbox. This allows the script to perform seamlessly in the background without requiring any human intervention, as well as keeping the inbox free of any historic email clutter.

## Detailed Script Methodology
My GAS begins by connecting to the Gmail account associated with the current script user. If there are multiple email addresses associated with this one account, only the first email address located will be used - this will be the 




## Script Requirements
