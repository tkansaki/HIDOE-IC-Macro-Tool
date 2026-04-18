# HIDOE IC MACRO TOOL
This is a Chrome Extension that was built by Trevor Kansaki for use by the Unit 2 staff of the STSSB. This will allow the ability to add, edit, and delete data on mass from the front end of the Hawaii Infinite Campus website. This tool only works on the "New Look" and will show an error message that you are not on the correct page if you are still working on the old platform.

-Versions before v6.0 will not work on current production version of IC as of 12/30/2024. 
-Versions before v8.3 will not work on current production version of IC as of 04/17/2026.
-Version v9.0 works on the current production version of IC as of 04/17/2026. 

Current Features:
- District Assignments Page Macros
	- Add District Assignments
	- Edit District Assignments
	- Delete District Assignments
- User Editor Page Macros
	- Add User Calendar
	- Remove User Calendars
	- Cleanup
	- Auto SS
	- Other Tools
## How to install
First, download the latest release, then unzip the .zip or .tar.gz and take note of where the file unzips. The zip should unzip as a file named "HIDOE-IC-Macro-Tool-x.x". In your chrome browser, type the url "chrome://extensions/", then click enter. This should bring you to the extensions page. Ensure that the developer mode is on by making sure the "Developer mode" switch on the top right corner is switched on. If developer mode is on, you should see the option "Load unpacked" on the top left of the page. Click load unpacked, then find and select your unzipped file, then click "Select folder" (Windows) or "choose" (IOS). The extension should show under "All Extensions" as "IC Macro Tool".
## District Assignments Page Macro Tools
The tools for the District Assignments page should only show up when you are on the District Assignments page in the new look. Tools will not show up otherwise.
### Add District Assignments
To use this tool, first click on the extension icon, then ensure that you are on the "Add" tab. Then choose your schools either by Complex, Complex Area, District, or State (All Schools). Choose whether or not you want to include Elementary Schools, Secondary Schools, and/or Charter schools. The Elementary Schools and Secondary Schools selection are inclusive, meaning it will add schools that service both Elementary and Secondary, even if just one is selected. Next choose a Start Date. Infinite Campus requires that a start date is selected before submission. You can now choose to fill and/or check off the rest of the fields in the form. (Some fields are not included because their selection changes based on the individual school selected.) Leaving fields blank will leave the same fields blank on the district assignment.
### Edit District Assignments
To use this tool, first click on the extension icon, then ensure that you are on the "Edit" tab. Then choose your schools on the left column either by Complex, Complex Area, District, or State (All Schools). Choose whether or not you want to include Elementary Schools, Secondary Schools, and/or Charter schools. The Elementary Schools and Secondary Schools selection are inclusive, meaning it will add schools that service both Elementary and Secondary, even if just one is selected. Next, choose your filters by clicking the "+" button. Select a field parameter, then set the value. This will limit the tool to only edit District Assignments whose fields match the values you have chosen. Unadded Parameters will be ignored. On the right side, add the parameters you would like to change, then set the value you want it to be set to. Press the "start" button, then all district assignments that match your parameters will have your selected values changed.
### Delete District Assignments
To use this tool, first click on the extension icon, then ensure that you are on the "Delete" tab. Then choose your schools on the left column either by Complex, Complex Area, District, or State (All Schools). Choose whether or not you want to include Elementary Schools, Secondary Schools, and/or Charter schools. The Elementary Schools and Secondary Schools selection are inclusive, meaning it will add schools that service both Elementary and Secondary, even if just one is selected. Next, choose your filters by clicking the "+" button in the right column. Select a field parameter, then set the value. This will limit the tool to only edit District Assignments whose fields match the values you have chosen. Unadded Parameters will be ignored. On the right side, add the parameters you would like to change, then set the value you want it to be set to. Press the "start" button, then in the prompt, type "delete" to confirm that you intend for a mass deletion of District Assignments. All district assignments that match your parameters will be deleted.

Once you have completed filling the form on the extension popup, click start and the District Assignments will be automatically added one by one. For larger lists of schools, this may take a few minutes. You will be alerted upon completion with an alert dialogue.
## User Editor Page Macro Tools
The tools for the User Editor page should only show up when you are on the user editor page in the new look. Tools will not show up otherwise. Certain tools require certain conditions such as having the user account information expanded rather than just the list of user accounts showing. This tool also requires that the account type be one that allows the selection/addition of user roles. (Campus Instruction/Tools)
### Add User Calendar
To use this tool, first click on the extension icon, then ensure that you are on the "Add" tab. Then choose your schools either by Complex, Complex Area, District, or State (All Schools). Choose whether or not you want to include Elementary Schools, Secondary Schools, and/or Charter schools. The Elementary Schools and Secondary Schools selection are inclusive, meaning it will add schools that service both Elementary and Secondary, even if just one is selected. Next check off what calendars you would like to include. (Current, Future, Previous, Summer School). Click start and the user roles should be added in a couple seconds. You will be alerted upon completion.
### Remove User Calendar
To use this tool, first click on the extension icon, then ensure that you are on the "Remove" tab. Then choose your schools either by Complex, Complex Area, District, or State (All Schools). Choose whether or not you want to include Elementary Schools, Secondary Schools, and/or Charter schools. The Elementary Schools and Secondary Schools selection are inclusive, meaning it will add schools that service both Elementary and Secondary, even if just one is selected. Next check off what calendars you would like to include. (Current, Future, Previous, Summer School). Click start and the user roles should be added in a couple seconds. You will be alerted upon completion.
### Cleanup
First, use the ad Hoc in Infinite Campus to download an XLSX excel file of all the user accounts that have no logins within the past 90 days by following the "SIS - Infinite Campus Account Cleanup Process document" in the Process Library. To use this tool, you must navigate to the user editor page (User Management > User Account Administration > User Account). Click on the extension icon, then ensure that you are on the "Cleanup" tab. Click "Choose File" and select the XLSX that was downloaded from Infinite Campus. If the file is correct, the start button should become active. Once you click the start button, this tool will automatically lookup every User ID# and disable the account associated with it. Any account containing \*INV will be skipped and logged. When the process ends, an alert will notify you and a CSV will be downloaded indicating all the users that were disabled and the roles that were removed. This tool will work with XLSX, XLS, and CSV's so long as there is a column that is labeled "EID" at the top.
### Auto SS
This tool will automatically provision accounts in a Summer School Access request. To use this tool, highlight the list in a Summer School Access request, then copy it by pressing CTRL + C. Paste in the main text area of this tool by pressing CTRL + V. Select the correct school for this request, then click "Parse". Verify that the resulting data extracted is correct, then press "Start".

This tool also comes equipped with an automatic work notes generator. After parsing the data, you can click "Show Worknotes" to show the messages to paste in the Worknotes and Additional Comments section of the request in Service-Now.
### Other Tool
This page contains miscellaneous tools to help with various tasks.

Disable User: This tool will disable the current user and allow you to copy the removed roles to your clipboard. You will still need to click save when using this tool.

Copy Current Roles: This tool will allow you to copy the users current roles to your clipboard.
