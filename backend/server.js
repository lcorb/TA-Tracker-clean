const os = require('os');
const add = os.networkInterfaces();
const ipv4 = add.Ethernet === undefined ? add.WiFi[1].address : add.Ethernet[1].address;

const express = require('express');
const logger = require('morgan');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

const studentRouter = require('./routes/students');
const studentClassRouter = require('./routes/studentclasses');
const allStudentsRouter = require('./routes/allstudents');

const classCodeRouter = require('./routes/classcode');
const classSubjectRouter = require('./routes/classsubject');
const classYearRouter = require('./routes/classyear');
const classStaffCodeRouter = require('./routes/classstaffcode');
const classStudentEQIDRouter = require('./routes/classbystudent');
const classParentRouter = require('./routes/parentsbyclass');
const classStudentRouter = require('./routes/studentsbyclass');
const classAidesRouter = require('./routes/fetchaidesbyclasscode');
const classTimetabledAidesRouter = require('./routes/fetchtimetabledaides');
const classesRouter = require('./routes/classes');

const misTeacherRouter = require('./routes/teacher');
const teachersRouter = require('./routes/teachers');

const misAideRouter = require('./routes/fetchaidebymis.js');
const createAideRouter = require('./routes/createaide');
const createAideClassRouter = require('./routes/createaideclass');
const deleteAideClassRouter = require('./routes/deleteaideclass');
const deleteAideRouter = require('./routes/deleteaide');
const fetchAidesRouter = require('./routes/fetchaides');

const insertAideTimetableRouter = require('./routes/insertaidetimetable');
const deleteAideTimetableRouter = require('./routes/deleteaidetimetable');

const metricsRouter = require('./routes/metrics');

const db = require('./generator/js/db/init');

const server = http.listen(3500, ipv4, () => {
    const addr = server.address();
    console.log(`API connected ( ${ipv4}:${addr.port} )`);
});

// spawn database instance
const database = new db.db();
database.init('./data/db/main.db')
    .catch(e => { throw e })
    .then(async (dbIsNew) => {
        if (dbIsNew) {
            database.log('created', 'database');
            console.log('Fresh database.');
        }
        // generate/update data
        // if database is new, perform extra queries
        //await database.generate(dbIsNew);
        database.log('connected', 'database');
    });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/student/eqid/:eqid', studentRouter);
app.use('/student/eqid/:eqid/classes', studentClassRouter);
app.use('/students', allStudentsRouter);

app.use('/class/code/:code', classCodeRouter);
app.use('/class/code/:code/aides', classAidesRouter);
app.use('/class/code/:code/aides/timetabled', classTimetabledAidesRouter);
app.use('/class/code/:code/parents', classParentRouter);
app.use('/class/code/:code/students', classStudentRouter);
app.use('/class/subject/:subject', classSubjectRouter);
app.use('/class/year/:year', classYearRouter);
app.use('/class/staff/:staff_code', classStaffCodeRouter);
app.use('/class/student/eqid/:eqid', classStudentEQIDRouter);
app.use('/classes', classesRouter);

app.use('/teacher/mis/:mis', misTeacherRouter);
app.use('/teachers', teachersRouter);

app.use('/aide/:mis', misAideRouter);
app.use('/aide/create', createAideRouter);
app.use('/aide/class/create', createAideClassRouter);
app.use('/aide/:mis/class/:id/delete', deleteAideClassRouter);
app.use('/aide/delete/:mis', deleteAideRouter);
app.use('/aides', fetchAidesRouter);

app.use('/timetable/aide/insert', insertAideTimetableRouter);
app.use('/timetable/aide/delete', deleteAideTimetableRouter);

app.use('/metrics', metricsRouter);

module.exports = { app, database };
