import { XLSX } from './xlsx.js';

document.getElementById("uploadInput").addEventListener("change", (event) => {
  handleDropAsync(event);
});

function printTable(sheet) {
	let range = parseRange(sheet["!ref"]);
	let rowHead = document.createElement("tr");
	for (let j = 0; j < 3; j++) {
		let data = document.createElement("th")
		data.innerHTML = sheet[`${String.fromCharCode(65 + j)}1`].v
		rowHead.appendChild(data)
	}
	document.getElementById("mainTable").appendChild(rowHead);
	for (let i = 2; i <= range.rowMax; i++) {
		let row = document.createElement("tr");
		for (let j = 0; j < 3; j++) {
			let data = document.createElement("td")
			data.innerHTML = sheet[`${String.fromCharCode(65 + j)}${i}`].v
			row.appendChild(data)
		}
		document.getElementById("mainTable").appendChild(row);
	}
}

function parseRange(rangeStr) {
	let cells = rangeStr.split(":");
	let colMin = "";
	let colMax = "";
	let rowMin, rowMax;
	let loc = 0;
	for (let j = 0; j < cells[0].length; j++) {
		if (isNaN(cells[0].charAt(j))) {
			console.log(cells[0].charAt(j));
			colMin = colMin + cells[0].charAt(j);
			loc = j;
		}
	}
	rowMin = parseInt(cells[0].slice(loc + 1));
	loc = 0;
	for (let j = 0; j < cells[1].length; j++) {
		if (isNaN(cells[1].charAt(j))) {
			colMax = colMax + `${cells[1].charAt(j)}`;
			loc = j;
		}
	}
	rowMax = parseInt(cells[1].slice(loc + 1));
	return {colMin, colMax, rowMin, rowMax};
}

async function handleDropAsync(e) {
  e.stopPropagation(); e.preventDefault();
  const f = e.target.files[0];
  /* f is a File */
  const data = await f.arrayBuffer();
  /* data is an ArrayBuffer */
  const workbook = XLSX.read(data);
  printTable(workbook.Sheets["Sheet1"]);
}