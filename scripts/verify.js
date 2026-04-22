let data;
let savedInputElement;

function printTable() {
    let range = data.length;
    let mainTable = document.createElement("table");
    mainTable.className = "table table-sm";
    let rowHead = document.createElement("tr");
    let name = document.createElement("th");
    let id = document.createElement("th");
    let title = document.createElement("th");
    let action = document.createElement("th");
    let role = document.createElement("th");

    name.innerHTML = "Name";
    id.innerHTML = "ID";
    title.innerHTML = "Title";
    action.innerHTML = "Action";
    role.innerHTML = "Role";

    rowHead.appendChild(name);
    rowHead.appendChild(id);
    rowHead.appendChild(title);
    rowHead.appendChild(action);
    rowHead.appendChild(role);

    mainTable.appendChild(rowHead);
    for (let i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 5; j++) {
            let cell = document.createElement("td")
            if (data[i][j]) {
                cell.innerHTML = data[i][j];
            }
            row.appendChild(cell);
        }
        mainTable.appendChild(row);
    }
    savedInputElement = document.getElementById("mainArea").querySelector('textarea');
    document.getElementById("mainArea").innerHTML = "";
    document.getElementById("mainArea").appendChild(mainTable);
}

function parse() {
    const text = document.getElementById('pastedList').value;
    const rows = text.split('\n');
    data = [];
    for (let i = 0; i < rows.length; i++) {
        data.push(rows[i].split('\t'));
    }
    printTable();
    document.getElementById('startButton').disabled = false;
    document.getElementById('resetButton').disabled = false;
    document.getElementById('parseButton').disabled = true;
    // console.log(data);
}

function reset() {
    document.getElementById('startButton').disabled = true;
    document.getElementById('resetButton').disabled = true;
    document.getElementById('parseButton').disabled = false;
    document.getElementById("mainArea").innerHTML = "";
    document.getElementById("mainArea").appendChild(savedInputElement);

}

function start() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        let activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            oper: "SSverify",
            data,
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('parseButton').addEventListener('click', function (event) {
        parse();
    });
    document.getElementById('startButton').addEventListener('click', function (event) {
        start();
    });document.getElementById('resetButton').addEventListener('click', function (event) {
        reset();
    });
});