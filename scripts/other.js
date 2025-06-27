document.addEventListener('DOMContentLoaded', function () {
    let disableButton = document.getElementById('disableButton');

    disableButton.addEventListener('click', function (event) {
        event.preventDefault();
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, function (tabs) {
            let activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {
                oper: "disableUser",
            });
        });
    });
});