const { log, io } = require("lastejobb");
const path = require("path");
var XLSX = require("js-xlsx");

let inputFiles = io.findFiles("temp/art-truet-ubehandlet", ".xlsx");
inputFiles = inputFiles.reverse();

for (let inputFile of inputFiles) convertToJson(inputFile);

function convertToJson(fn) {
  log.info("Reading " + fn + "...");
  log.info("Behandler artslisten...");
  const workbook = XLSX.readFile(fn, {});
  const sheet = workbook.Sheets.Data;
  const rows = XLSX.utils.sheet_to_row_object_array(sheet, { header: 1 });
  const { header, headerRowCount } = readHeader(rows);
  var r = [];
  for (let j = headerRowCount; j < rows.length; j++) {
    const e = {};
    const row = rows[j];
    for (let col = 0; col < header.length; col++)
      if (row[col] !== "") e[header[col] || "Col" + col] = row[col];
    r.push(e);
  }
  io.skrivDatafil(path.parse(fn).name, r);
}

function readHeader(rows) {
  let header = [];
  const row = rows[0];
  for (let k = 0; k < row.length; k++) {
    if (!row[k]) continue;
    if (header[k]) header[k] += "_";
    header[k] = (header[k] || "") + row[k];
  }
  return { header, headerRowCount: 1 };
}
