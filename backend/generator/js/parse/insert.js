const fs = require("fs");
const xlsx = require(`xlsx`);
const read = require('./read');


function getData(dir, reverse = false) {
  // Either will be used for student or class
  // Student is for gathering class data to push to student table
  // Class is gathering students to put in class table
  // The order in which data is read is the opposite between these
  // Hence, reverse
  // if reverse is true, we are getting array of students for class
  // if reverse is false, we are getting array of classes for student
  return new Promise ((resolve, reject) => {
    fs.readdir (dir, function(e, files) {
      if (e) throw e;
      files.forEach(async function (filename, i) {
        if (filename === 'archive') { return };
        console.log(`Reading ${filename}...`);
        await read.readXLSX (dir + filename)
          .then ((workbook) => {
            const data = workbook.Sheets[workbook.SheetNames[0]];
            var range = xlsx.utils.decode_range(data[`!ref`]);    
            let buffer = new Map();
            let rowBuffer = [];
            // Row
            for (let count = 1; count <= range.e.r; count++) {
              rowBuffer = [];
              // Col
              for (let colCount = range.s.c; colCount <= range.e.c; colCount++) {
                let cellAddress = {
                  c: colCount,
                  r: count
                };
                if (data[xlsx.utils.encode_cell(cellAddress)] === undefined) {
                  continue;
                } else {
                  rowBuffer.push(data[xlsx.utils.encode_cell(cellAddress)].v);
                }
              }
              // This is horrible but essentially just determines what will be the key to collect values for,
              // So either collecting students for a single class, which means class is the key
              // or collecting classes for a single student, which means student is the key
              if (buffer.has(rowBuffer[reverse ? 1 : 0])) {
                let values = buffer.get(rowBuffer[reverse ? 1 : 0]);
                values.push(rowBuffer[reverse ? 0 : 1]);
                buffer.set(rowBuffer[reverse ? 1 : 0], values);
              } else {
                buffer.set(rowBuffer[reverse ? 1 : 0], [rowBuffer[reverse ? 0 : 1]]);
              }
            }
            resolve(buffer);
          })
          .catch (e => {
            reject(e);
          });
      });
    });
  })
}

module.exports = {getData};