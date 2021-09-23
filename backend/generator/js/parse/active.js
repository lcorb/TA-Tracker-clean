const xlsx = require('xlsx');
const { find } = require('../utils');

function fetchLeftStudents(dir) {
    return new Promise(async (resolve, reject) => {
        const workbook = xlsx.readFile(await find(dir, 'DynamicStudentList'));
        const sheetList = workbook.SheetNames;
        const data = workbook.Sheets[sheetList[0]];
        const parsed = xlsx.utils.sheet_to_json(data, {header: 
            ["Student_Name", "EQ_ID", "Roll_Class", "Year", "Departure_Date"], raw: false});

        if (!parsed.length) {
            reject(new Error('Couldn\'t resolve EQIDs.'));
        }
    
        let eqids = {};
    
        // Start off reading from the 5th line
        for (i = 5; i < parsed.length; i++) {
            eqids[parsed[i].EQ_ID] = parsed[i].Departure_Date;
        }
    
        resolve(eqids);
    })
}

module.exports = fetchLeftStudents;