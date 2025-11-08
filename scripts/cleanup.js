import { XLSX } from './xlsx.js';

let uploadedSheet;

function letterBase26ToInt(str) {
	return str.split('').reduce((a, c) => (a * 26) + parseInt(c, 36) - 9, 0);
}

function intToletterBase26(num) {
	let arr = [];

	while (num > 0) {
	    if (num % 26 == 0) {
	        num = Math.trunc(num / 26)
	        if (num >= 1) {
	            arr.push(26)
	            num--;
	        }
	    } else {
	        arr.push(num % 26)
	        num = Math.trunc(num / 26)
	    }
	}

	return arr.reduce((a, c) => a = (c + 9).toString(36) + a, "").toUpperCase();
}

function parseRange(rangeStr) {
	let cells = rangeStr.split(":");
	let rowMin, rowMax, colMin, colMax;
	let loc = 0;
	let temp = "";
	for (let j = 0; j < cells[0].length; j++) {
		if (isNaN(cells[0].charAt(j))) {
			temp += cells[0].charAt(j);
			loc = j;
		}
	}
	colMin = letterBase26ToInt(temp);
	rowMin = parseInt(cells[0].slice(loc + 1));
	loc = 0;
	temp = "";
	for (let j = 0; j < cells[1].length; j++) {
		if (isNaN(cells[1].charAt(j))) {
			temp += cells[1].charAt(j);
			loc = j;
		}
	}
	colMax = letterBase26ToInt(temp);
	rowMax = parseInt(cells[1].slice(loc + 1));
	return {colMin, colMax, rowMin, rowMax};
}

function printTable(sheet) {
	document.getElementById("mainTable").innerHTML = "";
	let range = parseRange(sheet["!ref"]);
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

function findColumn(sheet, colName) {
	const range = parseRange(sheet["!ref"]);
	for (let i = 1; i <= range.colMax; i++) {
		if(sheet[`${intToletterBase26(i)}1`]) {
			if (colName.localeCompare(sheet[`${intToletterBase26(i)}1`].v) == 0) {
				return i;
			}
		}
	}
	return 0;
}

function setMessage(msg) {
	document.getElementById("errorMsg").innerHTML = `<p class="mb-0">${msg}</p>`;
	document.getElementById("errorMsg").style.display = "block";
}

function clearMessage() {
	document.getElementById("errorMsg").innerHTML = "";
	document.getElementById("errorMsg").style.display = "none";
}

function enableStart() {
	document.getElementById("startButton").disabled = false;
}

function disableStart() {
	document.getElementById("startButton").disabled = true;
}

async function handleDropAsync(e) {
  e.stopPropagation(); e.preventDefault();
  const f = e.target.files[0];
  /* f is a File */
  const data = await f.arrayBuffer();
  /* data is an ArrayBuffer */
  const workbook = XLSX.read(data);
  uploadedSheet = workbook.Sheets["Sheet1"];
  printTable(workbook.Sheets["Sheet1"])
  const eid = findColumn(workbook.Sheets["Sheet1"], "USERNAME");
  if (eid > 0) {
  	enableStart()
  	clearMessage()
  } else {
  	disableStart()
  	setMessage("Cannot find column named USERNAME");
  }
}

function prepareData(sheet) {
	const range = parseRange(sheet["!ref"]);
	const eidCol = findColumn(sheet, "USERNAME");
	const fNameCol = findColumn(sheet, "FIRST NAME");
	const lNameCol = findColumn(sheet, "LAST NAME");
	let data = [];

	for (let i = 2; i <= range.rowMax; i++) {
		let obj = {
			EID: "",
		  firstName: "",
		  lastName: ""
		};
		for (let j = 1; j <= range.colMax; j++) {
			if (sheet[`${intToletterBase26(j)}${i}`]) {
				if (j == eidCol) {
					obj.EID = sheet[`${intToletterBase26(j)}${i}`].v
				} else if (j == fNameCol) {
					obj.firstName = sheet[`${intToletterBase26(j)}${i}`].v
				} else if (j == lNameCol) {
					obj.lastName = sheet[`${intToletterBase26(j)}${i}`].v
				}
			}
		}
		data.push(obj);
	}
	return data;
}

document.addEventListener('DOMContentLoaded', function () {

    let uploadInput = document.getElementById("uploadInput");
    let startButton = document.getElementById('startButton');

    uploadInput.addEventListener("change", function (event) {
      handleDropAsync(event);
    });

    startButton.addEventListener('click', function (event) {
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, function (tabs) {
            let activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {
                oper: "cleanup",
                data: prepareData(uploadedSheet)
            });
        });
    });
});
