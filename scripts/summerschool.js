import schools from "./schools.js"

let data;

document.addEventListener('DOMContentLoaded', function() {
    let options = [];
    options.push(`<option value="" selected="selected">Choose School</option>`);
    for (let i = 0; i < schools.length; i++){
        options.push(`<option value="${i}">${schools[i].schoolName}</option>`);
    }
    document.getElementById('school').innerHTML = options;
    document.getElementById('parseButton').addEventListener('click', function (event) {
        parse();
    });
    document.getElementById('startButton').addEventListener('click', function (event) {
        start();
    });
    document.getElementById('showButton').addEventListener('click', function (event) {
        document.getElementById('notes').style.display = "block";
        outputComment();
        outputWorkNotes()
    });
    document.getElementById('copyAdditionalComments').addEventListener('click', function (event) {
        copyAdditionalComments();
    });
    document.getElementById('copyWorkNotes').addEventListener('click', function (event) {
        copyWorkNotes();
    });
});

function copySuccess() {
    let msg = document.createElement('div');
    msg.className = "alert alert-success";
    msg.innerHTML = "Copied Sucessfully";
    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.width = "95%";
    document.getElementById('notes').appendChild(msg);
    setTimeout(() => {
        msg.animate([{opacity: 1},{opacity: 0}], {duration: 1000})
        msg.style.opacity = "0";
        setTimeout(() => {msg.remove()}, 1000);
    }, 2000)
}

function copyFail() {
    let msg = document.createElement('div');
    msg.className = "alert alert-danger";
    msg.innerHTML = "Copied Failed";
    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.width = "95%";
    document.getElementById('notes').appendChild(msg);
    setTimeout(() => {
        msg.animate([{opacity: 1},{opacity: 0}], {duration: 1000})
        msg.style.opacity = "0";
        setTimeout(() => {msg.remove()}, 1000);
    }, 2000)
}

function copyAdditionalComments() {
    try {
        navigator.clipboard.writeText(document.getElementById("additionalComments").value);
        copySuccess();
    } catch (e){
        copyFail();
    }
}

function copyWorkNotes() {
    try {
        navigator.clipboard.writeText(document.getElementById("workNotes").value); 
        copySuccess();
    } catch (e){
        copyFail();
    }
}

function outputComment() {
    let text = "Your Access Request Form has been processed for:\n";
    for (let i = 0; i < data.length; i++) {
        text += `${data[i][0]}\n`;
    }
    text += "\nThe indicated roles were added/removed. Their username and password has not been changed. If the following user(s) is unable to log in, please contact the IT Help Desk.\n\n"
    text += "ANY ACCOUNTS THAT HAVE BEEN INACTIVE FOR 90 DAYS WILL BE AUTOMATICALLY DISABLED. YOU WILL NEED TO SUBMIT AN ACCESS REQUEST FORM TO REINSTATE ACCESS."
    document.getElementById('additionalComments').value = text;
}

function outputWorkNotes() {
    let text = "";
    const calendar = `SS ${schools[document.getElementById('school').value].schoolName}`;
    let teacherRole = "";
    if (schools[document.getElementById('school').value].elementary) {
        teacherRole += "*Summer School Elementary Teacher\n"
    }
    if (schools[document.getElementById('school').value].secondary) {
        teacherRole += "*Summer School Secondary Teacher\n"
    }
    for (let i = 0; i < data.length; i++) {
        if (data[i][3].includes("Request Access")) {
            text += `Added to ${data[i][0]} (${data[i][1]}):\n`;
        } else {
            text += `Removed from ${data[i][0]} (${data[i][1]}):\n`;
        }
        text += `Added to ${data[i][0]} (${data[i][1]}):\n`;
        text += `${calendar}\n`;
        if (data[i][4].includes("Summer School Data Entry")) {
            text += "*Summer School Data Entry Staff\n";
        }
        if (data[i][4].includes("Summer School Teacher")) {
            text += `${teacherRole}`;
        }
        text += '\n';
    }
    document.getElementById('workNotes').value = text;
}

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
    document.getElementById("mainArea").innerHTML = "";
    document.getElementById("mainArea").appendChild(mainTable);
}

function parse() {
    const text = document.getElementById('pastedList').value;
    const school = schools[document.getElementById('school').value];
    const rows = text.split('\n');
    console.log(document.getElementById('school').value)
    if (document.getElementById('school').value === "") {
        alert("Please Choose a School");
        return;
    }
    data = [];
    for (let i = 0; i < rows.length; i++) {
        data.push(rows[i].split('\t'));
    }
    printTable();
    document.getElementById('startButton').disabled = false;
    document.getElementById('resetButton').disabled = false;
    document.getElementById('showButton').disabled = false;
    document.getElementById('parseButton').disabled = true;
    document.getElementById('school').disabled = true;
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
            school: schools[document.getElementById('school').value],
            data,
        });
    });
}