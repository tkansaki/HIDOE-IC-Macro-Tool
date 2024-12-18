import schools from "./schools.js"
import { districts, complexAreas, complexes} from "./groups.js"

document.addEventListener('DOMContentLoaded', function() {
    let test = document.getElementById('test');

    test.addEventListener('click', function(event) {
        console.log("click!");
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            let activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {oper: "addCalendar", schools, future: false, previous: false});
        });
    });
});