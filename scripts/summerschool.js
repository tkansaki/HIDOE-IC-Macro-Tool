import schools from "./schools.js"

document.addEventListener('DOMContentLoaded', function() {
    let options = [];
    options.push(`<option selected="selected">Choose School</option>`);
    for (let i = 0; i < schools.length; i++){
        options.push(`<option value="${i}">${schools[i].schoolName}</option>`);
    }
    document.getElementById('school').innerHTML = options;
    document.getElementById('parseButton').addEventListener('click', function (event) {
        parse();
    });
});

function parse() {
    const text = document.getElementById('pastedList').value;
    const school = schools[document.getElementById('school').value];
    const rows = text.split('\n');
    const data = [];
    for (let i = 0; i < rows.length; i++) {
        data.push(rows[i].split('\t'));
    }
    // console.log(data);
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        let activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            oper: "SSAutoProv",
            school,
            type: document.getElementById('type').value,
            data,
        });
    });
}