const fs = require('fs');
const xlsx = require('xlsx');

function parseXLSX(dir, type = `full`) {
  return new Promise ((resolve, reject) => {
    fs.readdir (dir, function(e, files) {
      if (e) throw e;
      files.forEach(async function (filename, i) {
        if (filename === 'archive') { return };
        console.log(`Reading ${filename}...`);
        await readXLSX (dir + filename)
          .then (async (workbook) => {
            const sheetList = workbook.SheetNames;
            let sheetData = workbook.Sheets[sheetList[0]];
            // Read full list
            // This list is no longer across multiple sheets (???)
            // Weird change but code will remain to account for multiple sheets
            if (type === `full`) {
              // Headers lie on the 4th line in the first sheet ONLY, others start on 1st
              let headers = await fetchHeaders(sheetData, 4);
              const columnsToExclude = [`Email address`];
              var data = [];
                sheetList.forEach (function (sheetName) {
                  if (sheetName === `ReportCriteria` || sheetName === `0P`) {
                    // Skip
                    {}
                  } else {
                    sheetData = workbook.Sheets[sheetName];
                    // Data for every sheet other than first starts at line 4
                    data.push(readLine(sheetData, headers, columnsToExclude, 5));
                  }
                });
                // Since we have read across different sheets, combine our return array
                resolve(data.reduce((acc, val) => acc.concat(val), []));
            } else if (type === `timetable`) {
              let headers = await fetchHeaders(sheetData);
              const columnsToExclude = [`Start_Time`, `End_Time`, `Staff_Id`, `Date`, `Staff_Code`,
                                        `Staff_Last_Name`, `Staff_First_Name`, `Facility_Code`, `Facility_Name`];
              const data = readLine(sheetData, headers, columnsToExclude, 1, null, true, type);
              resolve(data);
            } else if (type === `teacher`) {
              let headers = await fetchHeaders(sheetData);
              const columnsToExclude = [`Class_Name`, `Subject_Name`, `Subject_Level_Code`,
                                        `Day`, `Date`, `Period`, `Start_Time`,
                                        `End_Time`, `Staff_Id`, `Staff_Code`, `Facility_Code`, `Facility_Name`];
              resolve(readLine(sheetData, headers, columnsToExclude, 1));
            } else if (type === `studentclass`) {
              let headers = await fetchHeaders(sheetData, 0);
              resolve(readLine(sheetData, headers, null, 1, null, true, type));
            } else {
              throw new Error(`Invalid read type ${type}`);
            }
            })          
          .catch (e => {
            reject(e);
          });
      });
    });
  })
}

function fetchHeaders(data, startRow = 0) {
  return new Promise((resolve, reject) => {
    var range = xlsx.utils.decode_range(data[`!ref`]);
    var buffer = [];
    
    for (var colCount = range.s.c; colCount <= range.e.c; colCount++) {
      if (data[xlsx.utils.encode_cell({c: colCount, r: startRow})] !== undefined) {
        buffer.push(data[xlsx.utils.encode_cell({c: colCount, r: startRow})].v);
      }
    }
    if (buffer.length === 0) {
      reject(new Error(`No headers found.`));
    } else {
      resolve(buffer);
    }
  })
}

function readLine(data, headers, columnsToExclude, start, end = null, map = false, type = null) {
  // If we need to efficiently collate similar data into a single entry, use a map instead of array
  var buffer = (map ? new Map() : []);
  var range = xlsx.utils.decode_range(data[`!ref`]);  

  if (end === null) {
    end = range.e.r;
  }

  for (var count = start; count < end; count++) {
    if (type === `timetable`) {
      if (data[xlsx.utils.encode_cell({c: 1, r: count})].v === `Roll Class`) {
        // Skip if we encounter subject type: Roll Class
        // When reading classes for timetables
        continue;
      }
      var timetable = {day: null, period: null};
    } else if (type === `studentclass`) {
      var studentClassBuffer = ``;
    }
    let rowBuffer = [];
    let colRange = headers > 0 ? headers.length : range.e.c;
    for (var colCount = range.s.c; colCount <= colRange; colCount++) {
      if (columnsToExclude) {
        if (columnsToExclude.includes(headers[colCount])) {
          continue;
        }
      }
      var cellAddress = {
        c: colCount,
        r: count
      };

      // Skip if theres nothing in that column
      if (data[xlsx.utils.encode_cell(cellAddress)] === undefined || data[xlsx.utils.encode_cell(cellAddress)].v === "") {
        continue;
      }
      else {
        if (headers) {
          // Ignore `day` and `period` from the main data collection since we need to combine these for timetables
          // Should probably generalise this at some point
          if (headers[colCount] === `Day`) {
            if (data[xlsx.utils.encode_cell(cellAddress)].v == null) {
              // Next column over is date column in format of 31/01/19
              utils.getDayOfWeek(data[xlsx.utils.encode_cell(cellAddress) + 1].v)
            }
            timetable.day = data[xlsx.utils.encode_cell(cellAddress)].v;
          } else if (headers[colCount] === `Period`) {
            timetable.period = data[xlsx.utils.encode_cell(cellAddress)].v;          
          } else if (headers[colCount] === `Class_Name` && type === `studentclass`) {
            studentClassBuffer = data[xlsx.utils.encode_cell(cellAddress)].v;
          } else {
            rowBuffer.push(data[xlsx.utils.encode_cell(cellAddress)].v);
          }
        } else {
          rowBuffer.push(data[xlsx.utils.encode_cell(cellAddress)].v);
        }        
      }
    }
    
    // If we are only retrieving a single line, return straight away
    if (start === end) {
      return rowBuffer;
    }

    // Build map for timetables
    if (map) {
      if (type === `timetable`) {
        if (buffer.has(rowBuffer[0])) {
        let values = buffer.get(rowBuffer[0]);
        buffer.set(rowBuffer.shift(), {data: rowBuffer,
          timetable: Object.assign(values.timetable, 
                                  {[Object.keys(values.timetable).length + 1]: [timetable[`day`],timetable[`period`]]})});
          } else {
            buffer.set(rowBuffer.shift(), {data: rowBuffer, timetable: {1: [timetable[`day`],timetable[`period`]]}});
          }
      } else if (type === `studentclass`) {
        if (buffer.has(rowBuffer[0])) {
          let values = buffer.get(rowBuffer[0]);
          buffer.set(rowBuffer[0], {[Object.keys(values.timetable).length + 1]: studentClassBuffer}) 
  
          } else {
            buffer.set(rowBuffer[0], {1: studentClassBuffer}) 
          }
      }
    } else {
      // Otherwise build an array
      buffer.push(rowBuffer);
    }
  }
  return buffer;
}

function readXLSX (file) {
  return new Promise (function (resolve, reject) {
    var workbook = xlsx.readFile(file)
    if (!workbook) {
      reject(new Error(`Unable to read xlsx file!`));
    } else {
      resolve (workbook);
    }
    
  });
}

module.exports = {
  parseXLSX,
  readXLSX,
};