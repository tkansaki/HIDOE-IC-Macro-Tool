import schools from "./schools.js"

let data;

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

function printTable() {
    let range = data.length;
    let rowHead = document.createElement("tr");
    for (let j = 1; j <= 3; j++) {
        let data = document.createElement("th");
        if (sheet[`${intToletterBase26(j)}1`]) {
            data.innerHTML = sheet[`${intToletterBase26(j)}1`].v
        }
        rowHead.appendChild(data)
    }
    document.getElementById("mainTable").appendChild(rowHead);
    for (let i = 2; i <= range.rowMax; i++) {
        let row = document.createElement("tr");
        for (let j = 1; j <= 3; j++) {
            let data = document.createElement("td")
            if (sheet[`${intToletterBase26(j)}${i}`]) {
                data.innerHTML = sheet[`${intToletterBase26(j)}${i}`].v
            }
            row.appendChild(data)
        }
        document.getElementById("mainTable").appendChild(row);
    }
}

function parse() {
    const text = document.getElementById('pastedList').value;
    const school = schools[document.getElementById('school').value];
    const rows = text.split('\n');
    data = [];
    for (let i = 0; i < rows.length; i++) {
        data.push(rows[i].split('\t'));
    }
    // console.log(data);
}

function start() {
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