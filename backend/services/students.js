const call = require(`../routes/handle`);

async function fetch(res, eqid) {
    const api = require(`../server`);
    api.database.get(`
    SELECT *
    FROM students
    WHERE eqid = ?
    `, eqid, call, res);
}

async function fetchAll(res) {
    const api = require(`../server`);
    api.database.all(`
    SELECT *
    FROM students
    `, [], call, res);
}

async function fetchStudentCount(res) {
    const api = require(`../server`);
    api.database.get(`
    SELECT COUNT(eqid) FROM students
    `, [], call, res)
}

async function fetchStudentClasses(res, eqid) {
    const api = require(`../server`);
    api.database.all(`
    SELECT c.code, c.subject, c.timetable, t.mis, t.firstname, t.lastname
    FROM class c, json_each(c.students), teachers t
    WHERE json_each.value = ? AND t.mis = c.staff_code
    `, eqid, call, res);
}

function fetchAIMSStudentsWithoutCSM(res) {
    const api = require(`../server`);
    api.database.all(`
    SELECT s.eqid, s.studentname FROM students s
    WHERE s.aims = '1' AND s.active = 'Yes'
    AND CASE WHEN (SELECT 1 FROM studentclass sc WHERE sc.class_code LIKE "%CSM%" AND s.eqid = sc.eqid) = 1 THEN 0 ELSE 1 END
    `, eqid, call, res);
}

module.exports = {
    fetch,
    fetchAll,
    fetchStudentCount,
    fetchStudentClasses,
    fetchAIMSStudentsWithoutCSM
};