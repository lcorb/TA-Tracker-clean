const call = require(`../routes/handle`);

async function fetchGeneralMetrics(res) {
    const api = require(`../server`);
    api.database.all(`
    SELECT COUNT(code) as data FROM class
    WHERE class.code NOT LIKE "%CSM%" AND class.students NOT NULL
    UNION ALL
    SELECT COUNT(eqid) FROM students
    UNION ALL
    SELECT COUNT(DISTINCT(class_id)) FROM aideclass
    UNION ALL
    SELECT COUNT(json_each.value)
    FROM class c, json_each(c.students)
    UNION ALL
    SELECT COUNT(eqid) FROM students WHERE aims = 1
    UNION ALL
    SELECT COUNT(DISTINCT(s.eqid))
    FROM students s, class c, aideclass ac
    WHERE ac.class_id = c.code AND c.students LIKE '%' || s.eqid || '%' AND s.active = 'Yes' AND s.aims = 1
    UNION ALL
    SELECT COUNT(eqid) FROM students WHERE indigenous != 'Neither Aboriginal nor Torres Strait Islander Origin'
    UNION ALL
    SELECT COUNT(DISTINCT(s.eqid))
    FROM students s, class c, aideclass ac
    WHERE ac.class_id = c.code AND c.students LIKE '%' || s.eqid || '%' AND s.active = 'Yes' AND s.indigenous != 'Neither Aboriginal nor Torres Strait Islander Origin'
    `, [], call, res)
}

async function fetchStudentMetrics(res) {
    const api = require(`../server`);
    const classCount = await api.database.all(`
        SELECT t.n, COUNT(*) studentCount
        FROM (SELECT COUNT(*) as n FROM studentclass WHERE active = 'Yes' GROUP BY eqid) t
        GROUP BY t.n`, [], null, null);

    const gender = await api.database.all(`
        SELECT f.n Female, m.n Male
        FROM (SELECT COUNT(*) as n FROM students WHERE gender = 'M') m, (SELECT COUNT(*) as n FROM students WHERE gender = 'F') f
        `, [], null, null);

    const indigenous = await api.database.all(`
        SELECT its.n ITS, i.n I, ts.n TS, n.n N
        FROM (SELECT COUNT(*) as n FROM students WHERE indigenous = 'Both Aboriginal and Torres Strait Islander Origin') its,
            (SELECT COUNT(*) as n FROM students WHERE indigenous = 'Aboriginal but not Torres Strait Islander Origin') i,
            (SELECT COUNT(*) as n FROM students WHERE indigenous = 'Torres Strait Islander but not Aboriginal Origin') ts,
            (SELECT COUNT(*) as n FROM students WHERE indigenous = 'Neither Aboriginal nor Torres Strait Islander Origin') n
        `, [], null, null);

    const aims = await api.database.all(`
        SELECT a.n AIMS, na.n notAIMS
        FROM (SELECT COUNT(*) as n FROM students WHERE aims = '1') a, (SELECT COUNT(*) as n FROM students WHERE aims = '0') na
        `, [], null, null);

    const grade = await api.database.all(`
        SELECT p.n 'Prep', g1.n 'Grade 1', g2.n 'Grade 2', g3.n 'Grade 3', g4.n 'Grade 4', g5.n 'Grade 5', g6.n 'Grade 6', g7.n 'Grade 7', g8.n 'Grade 8', g9.n 'Grade 9', g10.n 'Grade 10', g11.n 'Grade 11', g12.n 'Grade 12'
        FROM (SELECT COUNT(*) as n FROM students WHERE grade LIKE '%P%') p,
        (SELECT COUNT(*) as n FROM students WHERE grade = '1') g1,
        (SELECT COUNT(*) as n FROM students WHERE grade = '2') g2,
        (SELECT COUNT(*) as n FROM students WHERE grade = '3') g3,
        (SELECT COUNT(*) as n FROM students WHERE grade = '4') g4,
        (SELECT COUNT(*) as n FROM students WHERE grade = '5') g5,
        (SELECT COUNT(*) as n FROM students WHERE grade = '6') g6,
        (SELECT COUNT(*) as n FROM students WHERE grade = '7') g7,
        (SELECT COUNT(*) as n FROM students WHERE grade = '8') g8,
        (SELECT COUNT(*) as n FROM students WHERE grade = '9') g9,
        (SELECT COUNT(*) as n FROM students WHERE grade = '10') g10,
        (SELECT COUNT(*) as n FROM students WHERE grade = '11') g11,
        (SELECT COUNT(*) as n FROM students WHERE grade = '12') g12
        `, [], null, null);


    call(res, { 'classCount': classCount, 'gender': gender, 'indigenous': indigenous, 'aims': aims, 'grade': grade });
}

async function fetchClassMetrics(res) {
    const api = require(`../server`);
    const studentCount = await api.database.all(`
    SELECT t.n, COUNT(*) classCount
    FROM (SELECT COUNT(*) as n FROM studentclass WHERE active = 'Yes' GROUP BY class_code) t
    GROUP BY t.n`, [], null, null);

    const topSubjectCount = await api.database.all(`
    SELECT t.s subject, t.n count
    FROM (SELECT COUNT(*) as n, subject s FROM class GROUP BY subject) t
    GROUP BY t.s
    ORDER BY count desc
    LIMIT 10`, [], null, null);

    const bottomSubjectCount = await api.database.all(`
    SELECT t.s subject, t.n count
    FROM (SELECT COUNT(*) as n, subject s FROM class GROUP BY subject) t
    GROUP BY t.s
    ORDER BY count asc
    LIMIT 10`, [], null, null);

    const teacherClassCount = await api.database.all(`
    SELECT t.n classCount, COUNT(*) teacherCount
    FROM (SELECT COUNT(*) as n FROM class WHERE staff_code != 'undefined' AND staff_code NOT NULL GROUP BY staff_code) t
    GROUP BY classCount`, [], null, null);

    const gradeClassCount = await api.database.all(`
    SELECT year grade, t.n classCount
    FROM (SELECT COUNT(*) as n, year FROM class WHERE staff_code != 'undefined' AND staff_code NOT NULL GROUP BY year) t
    GROUP BY classCount
    ORDER BY CAST(year as INTEGER)`, [], null, null);


    call(res, { 'studentCount': studentCount, 'topSubjectCount': topSubjectCount, 'bottomSubjectCount': bottomSubjectCount, 'teacherClassCount': teacherClassCount, 'gradeClassCount': gradeClassCount });
}


module.exports = { fetchGeneralMetrics, fetchStudentMetrics, fetchClassMetrics };

// class count per student
//
// SELECT json_each.value student, COUNT(json_each.value) classCount
// FROM class c, json_each(c.students)
// GROUP By json_each.value
// ORDER BY classCount DESC

// student counts for classes
//
// SELECT c.code, COUNT(json_each.value) as studentCount
// FROM class c, json_each(c.students)
// WHERE c.code NOT LIKE "%CSM%" AND c.students NOT NULL
// GROUP BY c.code
// ORDER BY studentCount DESC
// LIMIT 1