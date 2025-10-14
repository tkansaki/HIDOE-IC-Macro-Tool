import {XLSX} from './xlsx.js';

document.getElementById("uploadInput").addEventListener("change", (event) => {
  handleDropAsync(event);
});

async function handleDropAsync(e) {
  console.log("called");
  e.stopPropagation(); e.preventDefault();
  const f = e.target.files[0];
  /* f is a File */
  const data = await f.arrayBuffer();
  /* data is an ArrayBuffer */
  const workbook = XLSX.read(data);

  console.log(workbook.Sheets["Sheet1"]);
}