const path = require('path');
const read = require(`./js/parse/read`);
const insert = require(`./js/parse/insert`);
const fetchAIMS = require('./js/parse/aims');
const fetchLeftStudents = require('./js/parse/active');
const fetchParentInfo = require('./js/parse/parent');
const seed = require('./js/db/seeder');
const { find, archive } = require('./js/utils');

async function generate(db, initialGeneration = false) {
    const preQuery = new Date().getTime();
    await parseStudentData(db, initialGeneration);
    await parseClassData(db, initialGeneration);
    await parseTeacherData(db, initialGeneration);
    await parseClassStudentData(db, initialGeneration);
    await parseParentData(db, initialGeneration);
    if (initialGeneration) {
        await seed(db);
    }
    db.log('generate', 'success');
    const postQuery = new Date().getTime();
    const duration = (postQuery - preQuery) / 1000;
    console.log(`Done! (${duration}s)`);
}

function parseStudentData(db, initialGeneration) {
    return new Promise(async (resolve) => {
        try {
            const studentData = await read.parseXLSX('./data/sheets/student/');
            const aimsEQIDs = await fetchAIMS('./data/sheets/aims');
            const leftStudentEQIDs = await fetchLeftStudents('./data/sheets/left/');
            const cols = ['studentname', 'lastname', 'firstname', 'age', 'gender', 'roll', 'grade', 'indigenous', 'mis', 'aims'];

            console.log(initialGeneration ? 'Creating students.' : 'Updating students.');
            studentData.forEach((v) => {
                // v = [studentname, eqid, lastname, firstname, age, gender, roll, grade, indigenous, mis]
                v.push( aimsEQIDs[v[1]] ? 1 : 0 );

                if (initialGeneration) {
                    db.studentEntry.create(...v);
                } else {
                    const eqid = v.splice(1, 1)[0];
                    db.studentEntry.update(eqid, cols, v);
                }
            })

            db.studentEntry.setBulkInactive(leftStudentEQIDs);

            const studentDataFile = await find('./data/sheets/student', '');
            const aimsDataFile = await find('./data/sheets/aims', '');

            const archiveStudentData = archive(studentDataFile, `${path.dirname(studentDataFile)}/archive/${path.basename(studentDataFile)}`);
            const archiveAimsData = archive(aimsDataFile, `${path.dirname(aimsDataFile)}/archive/${path.basename(aimsDataFile)}`);

            await Promise.all([ archiveStudentData, archiveAimsData ]);

            resolve();
        } catch (e) {
            throw e;
        }
    })
}

function parseClassData(db, initialGeneration) {
    return new Promise(async (resolve) => {
        try {
            const classData = await read.parseXLSX(`./data/sheets/teacher/`, `timetable`);
            const cols = ['code', 'subject', 'year', 'staff_code', 'timetable'];
            console.log(initialGeneration ? 'Creating classes.' : 'Updating classes.');
            let itr = classData.entries();
            for (const v of itr) {
                if (initialGeneration) {
                    db.timetableEntry.create(v[1].timetable, v[0]);
                    // [code, subject, year, staff_code, timetable, students]
                    db.classEntry.create(v[0], v[1].data[0], v[1].data[1], v[1].data[2], JSON.stringify(v[1].timetable, null)); 
                } else {
                    db.classEntry.update(cols, [v[0], v[1].data[0], v[1].data[1], v[1].data[2], JSON.stringify(v[1].timetable)]); 
                }
            }

            resolve();
        } catch (e) {
            throw e;
        }
    })
}

function parseTeacherData(db, initialGeneration) {
    return new Promise(async (resolve) => {
        try {
            const teacherData = await read.parseXLSX(`./data/sheets/teacher/`, `teacher`);
            console.log(initialGeneration ? 'Creating teachers.' : 'Updating teachers.');
            teacherData.forEach((v) => {
                // occasionally empty teacher slots will be filled, those will be a differing length
                // also skip empty entries
                if (v.length === 3) {
                    db.teacherEntry.create(...v);
                }
            })

            const teacherDataFile = await find('./data/sheets/teacher', '');

            await archive(teacherDataFile, `${path.dirname(teacherDataFile)}/archive/${path.basename(teacherDataFile)}`);

            resolve();
        } catch (e) {
            throw e;
        }
    })
}

function parseClassStudentData(db, initialGeneration) {
    return new Promise(async (resolve) => {
        try {
            db.studentClassEntry.setInactive();
            const classStudentData = await insert.getData(`./data/sheets/class/`, true);
            const studentClassData = await insert.getData(`./data/sheets/class/`, false);
            console.log(initialGeneration ? 'Inserting students into classes.' : 'Updating class students.');

            const classStudentItr = classStudentData.entries();
            const studentClassItr = studentClassData.entries();

            for (const v of classStudentItr) {
                db.classEntry.updateStudents(v[0], [`students`], JSON.stringify(v[1], null, 0));
            }


            for (const v of studentClassItr) {
                v[1].forEach(c => {
                    if (c === undefined || v[0] === undefined) { return };
                    db.studentClassEntry.create(c, v[0]);
                })
            }

            const studentClassDataFile = await find('./data/sheets/class', '');

            await archive(studentClassDataFile, `${path.dirname(studentClassDataFile)}/archive/${path.basename(studentClassDataFile)}`);

            resolve();
        } catch (e) {
            throw e;
        }
    })
}

function parseParentData(db, initialGeneration) {
    return new Promise(async (resolve) => {
        try {
            const parentData = await fetchParentInfo(process.cwd() + '/data/sheets/email');
            console.log(initialGeneration ? 'Creating parents.' : 'Updating parents.');

            parentData.forEach(v => {
                db.parentEntry.create(v.lastname, v.firstname, v.email, v.eqid);
            });

            const parentFile = await find('./data/sheets/email', '');

            await archive(parentFile, `${path.dirname(parentFile)}/archive/${path.basename(parentFile)}`);

            resolve();
        } catch (e) {
            throw e;
        }
    })
}

module.exports = {generate};