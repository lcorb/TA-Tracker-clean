const call = require(`../routes/handle`);

async function fetchClassFromCode(res, code) {
    const api = require(`../server`);
    api.database.get(`
    SELECT *
    FROM class
    WHERE code = ?
    `, code, call, res);
}

async function fetchClassesFromStaffCode(res, staff_code) {
    const api = require(`../server`);
    api.database.all(`
    SELECT *
    FROM class
    WHERE staff_code = ?
    `, staff_code, call, res);
}

async function fetchClassesFromSubject(res, subject) {
    const api = require(`../server`);
    api.database.all(`
    SELECT *
    FROM class
    WHERE subject = ?
    `, subject, call, res);
}

async function fetchClassesFromYear(res, year) {
    const api = require(`../server`);
    api.database.all(`
    SELECT *
    FROM class
    WHERE year = ?
    `, year, call, res);
}

async function fetchAllClasses(res) {
    const api = require(`../server`);
    api.database.all(`
    SELECT *
    FROM class c, teachers t
    WHERE c.staff_code = t.mis
    `, [], call, res);
}

async function fetchClassesByStudent(res, eqid) {
    const api = require(`../server`);
    api.database.all(`
    SELECT * FROM class WHERE students LIKE "%${eqid}%"
    `, [], call, res)
}

async function fetchAidesByClassCode(res, code) {
    const api = require(`../server`);
    api.database.all(`
    SELECT ac.aide_mis as mis, a.firstname, a.lastname
    FROM aideclass ac
    LEFT JOIN aides a ON ac.aide_mis = a.mis
    WHERE ac.class_id = ?
    `, code, call, res);
}

async function fetchTimetabledAides(res, code) {
    const api = require(`../server`);
    api.database.all(`
    SELECT ta.aide_mis mis, t.day, t.period, a.firstname, a.lastname
    FROM timetable t
    LEFT JOIN timetableaide ta ON ta.timetable_id = t.id
    LEFT JOIN aides a ON a.mis = ta.aide_mis
    WHERE t.class_code = ? AND ta.aide_mis NOT NULL
    `, code, call, res);
}

async function fetchParents(res, code) {
    const api = require('../server');
    api.database.all(
        `SELECT p.email FROM parentstudent ps
        LEFT JOIN parents p ON ps.parent_id = p.id
        LEFT JOIN studentclass sc ON sc.eqid = ps.eqid
        WHERE sc.class_code = ?
        `, code, call, res)
}

async function fetchStudents(res, code) {
    const api = require('../server');
    api.database.all(
        `SELECT * FROM studentclass sc
        LEFT JOIN students s on sc.eqid = s.eqid
        WHERE sc.class_code = ?
        `, code, call, res)
}

module.exports = {
    fetchClassFromCode,
    fetchClassesFromSubject,
    fetchClassesFromYear,
    fetchClassesFromStaffCode,
    fetchAllClasses,
    fetchClassesByStudent,
    fetchAidesByClassCode,
    fetchTimetabledAides,
    fetchParents,
    fetchStudents
};