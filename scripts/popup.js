document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        let activeTab = tabs[0];
        let url = activeTab.url;
        if (
            url.includes("https://hawaii.infinitecampus.org/sandbox/sis/campus-tools/district-assignments") ||
            url.includes("https://hawaii.infinitecampus.org/campus/sis/campus-tools/district-assignments")
            ) {
            location.replace("/content/DA/addDA.html");
        } else if (
            url.includes("https://hawaii.infinitecampus.org/sandbox/sis/tools-core/user-account-editor") ||
            url.includes("https://hawaii.infinitecampus.org/campus/sis/tools-core/user-account-editor")
            ) {
            location.replace("/content/user/addcalendar.html");
        }
        else {
            location.replace("/content/error.html");
        }

    });
});