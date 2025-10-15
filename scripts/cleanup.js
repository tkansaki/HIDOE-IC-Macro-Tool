import { XLSX } from './xlsx.js';

document.getElementById("uploadInput").addEventListener("change", (event) => {
  handleDropAsync(event);
});

function printTable(sheet) {
	let rowHead = document.createElement("tr");
	for (let j = 0; j < 3; j++) {
		let data = document.createElement("th")
		data.innerHTML = sheet[`${String.fromCharCode(65 + j)}1`].v
		rowHead.appendChild(data)
	}
	document.getElementById("mainTable").appendChild(rowHead);
	for (let i = 2; i <= 10; i++) {
		let row = document.createElement("tr");
		for (let j = 0; j < 3; j++) {
			let data = document.createElement("td")
			data.innerHTML = sheet[`${String.fromCharCode(65 + j)}${i}`].v
			row.appendChild(data)
		}
		document.getElementById("mainTable").appendChild(row);
	}
}

async function handleDropAsync(e) {
  console.log("called");
  e.stopPropagation(); e.preventDefault();
  const f = e.target.files[0];
  /* f is a File */
  const data = await f.arrayBuffer();
  /* data is an ArrayBuffer */
  const workbook = XLSX.read(data);

  printTable(workbook.Sheets["Sheet1"]);
}