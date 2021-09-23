const xlsx = require('xlsx');
const { find } = require('../utils');

function fetchParentInfo(emailDir) {
    return new Promise(async (resolve, reject) => {
        const emailWorkbook = xlsx.readFile(await find(emailDir, 'ParentMobileEmailContactExport'));

        const emailSheetList = emailWorkbook.SheetNames;

        const emailData = emailWorkbook.Sheets[emailSheetList[0]];

        let headers = ["EQ_Id","Student_Given_Name","Student_Family_Name","Yr_Lvl_Cd","Roll_Class","House","MIS ID","Parent_Family_Name","Parent_Given_Name","Resides_With_Fg","Receives Correspondence","Contact_Desc","Contact_Detail","Needs Interpreter"];

        const parsedEmail = xlsx.utils.sheet_to_json(emailData, { header: headers });

        if (!parsedEmail.length) {
            reject(new Error('Couldn\'t resolve Parent info.'));
        }

        let parents = [];

        for (i = 1; i < parsedEmail.length; i++) {
            parents.push({
                "eqid": parsedEmail[i].EQ_Id,
                "lastname": parsedEmail[i].Parent_Family_Name,
                "firstname": parsedEmail[i].Parent_Given_Name,
                "email": parsedEmail[i].Contact_Detail
            })
        }

        resolve(parents);
    })
}

module.exports = fetchParentInfo;