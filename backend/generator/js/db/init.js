const sql = require(`sqlite3`).verbose();
const fs = require('fs');

const { student } = require(`./students`);
const { BSDEClass } = require(`./bsdeclass`);
const { teacher } = require(`./teacher`);
const { Aide } = require('./aide');
const { AideClass } = require('./aideclass');
const { Timetable } = require('./timetable');
const { TimetableAide } = require('./timetableaide');
const { StudentClass } = require('./studentclass');
const { Parent } = require('./parent');
const { ParentStudent } = require('./parentstudent');
const { Log } = require('./log');
const { generate } = require(`../../generate`);
const { archive } = require('../utils');

class db {
    constructor() {
        this.db = null;
        this.studentEntry = null;
        this.classEntry = null;
        this.teacherEntry = null;
        this.aideEntry = null;
        this.aideClassEntry = null;
        this.timetableEntry = null;
        this.timetableAideEntry = null;
        this.studentClassEntry = null;
        this.parentEntry = null;
        this.parentStudentEntry = null;
    }

    init(filePath) {

        const dbIsNew = !fs.existsSync(filePath);

        return new Promise((resolve, reject) => {
            this.db = new sql.Database(filePath, async (e) => {
                if (e) {
                    console.error(e.message + `\n` + filePath);
                    reject();
                }

                console.log(`Connected to db.`);
                this.logEntry = new Log(this);
                await this.logEntry.init();

                this.studentEntry = new student(this);
                await this.studentEntry.init();

                this.classEntry = new BSDEClass(this);
                await this.classEntry.init();

                this.teacherEntry = new teacher(this);
                await this.teacherEntry.init();

                this.aideEntry = new Aide(this);
                await this.aideEntry.init();

                this.aideClassEntry = new AideClass(this);
                await this.aideClassEntry.init();

                this.timetableEntry = new Timetable(this);
                await this.timetableEntry.init();

                this.timetableAideEntry = new TimetableAide(this);
                await this.timetableAideEntry.init();        
                
                this.studentClassEntry = new StudentClass(this);
                await this.studentClassEntry.init();

                this.parentEntry = new Parent(this);
                await this.parentEntry.init();

                this.parentStudentEntry = new ParentStudent(this);
                await this.parentStudentEntry.init();

                resolve(dbIsNew);
            });
        });
    }

    async generate(initialGeneration = false) {
        console.log('Attempting to generate data.');
        console.log('Verifying data exists.');
        await this.verify()
            .then(() => {
                console.log(`Looks good.\nGenerating data for: ${this.db.filename}`);
                generate(this, initialGeneration);
            })
            .catch(e => { 
                console.error(e.message);
                this.log('generate', e.message);
            });
    }

    verify() {
        return new Promise((resolve, reject) => {
            try {
                const failureString = (e) => `Unable to generate data!\nReason: ${e}`;
                const expectedDirs = ['aims', 'class', 'student', 'teacher', 'left', 'email'];
                const ignore = 'archive';
                const dir = process.cwd() + '/data/sheets';
        
                const dirs = fs.readdirSync(dir);
        
                if (!dirs || dirs.length !== expectedDirs.length) { 
                    throw(new Error(failureString(`Malformed or missing directory: './data/sheets'.\nExpected: [${expectedDirs.join(', ')}]`)));
                };
        
                dirs.forEach((v) => {
                    if (expectedDirs.includes(v)) {
                        let files = fs.readdirSync(`${dir}/${v}`);
                        files.sort((a, b) => {
                            return fs.statSync(`${dir}/${v}/${a}`).mtime.getTime() -
                                   fs.statSync(`${dir}/${v}/${b}`).mtime.getTime();
                        })
    
                        if (files.length < 2) {
                            throw(new Error(failureString(`No data file present in '${v}'`)));
                        } else if (files.length > 2) {
                            console.warn(`Too many files present in '${v}'\nArchiving ${files.length - 2} of them.`);
                            const len = files.length;
                            files.forEach(async (file, i) => {
                                if (i !== len - 1) {
                                    if (file !== ignore) {
                                        await archive(`${dir}/${v}/${file}`, `${dir}/${v}/archive/${file}`);
                                    }
                                }
                            })
                        }
    
                    } else {
                        throw(new Error(failureString(`Unexpected directory: ${v}!`)));
                    }
                })

                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }

    log(type, content) {
        return this.logEntry.create(type, content);
    }

    run(query, data = [], callback = null, res) {
        this.db.run(query, data, function (e) {
            let errors = [];
            if (e) {
                console.error(`Error running: ${query}\nWith: ${data.join(`\n`)}\n${e}`);
                switch (e.code) {
                    case 'SQLITE_CONSTRAINT':
                        errors.push(`Entry already exists: ${data.join(', ')}!`);
                        break;

                    default:
                        errors.push('Something went wrong :(');
                        break;
                }
            }

            if (callback) {
                if (callback === 'return') { 
                    return this.lastID;
                } else {
                    callback(res, errors = errors);
                }
            }
        })
    }

    runChain(query, data, next, nextArgs) {
        let db = this.db;
        this.db.run(query, data, function (e) { 
                if (e) throw e;
                next(db, this.lastID, ...nextArgs);
            }
        )
    }

    runMultiple(queries) {
        return new Promise(async (resolve, reject) => {
            this.db.exec(queries.join(';'), (e) => {
                if (e) throw e;
                resolve();
            });
        })
    }

    get(query, data = [], callback = null, res = null) {
        this.db.get(query, data, (e, row) => {
            if (e) {
                if (callback) {
                    callback(res, e);
                }
                console.error(`Error running: ${query}\n${e}`)
            } else {
                if (callback) {
                    callback(res, row ? row : `Not found.`);
                }
                return row ? row : `Not found.`;
            }
        })
    }

    all(query, data = [], callback = null, res = null) {
        return new Promise((resolve, reject) => {
            this.db.all(query, data, (e, rows) => {
                if (e) {
                    console.error(`Error running: ${query}\n${e}`)
                    if (callback) {
                        callback(res, e);
                    }
                    resolve (e);
                } else {
                    if (callback) {
                        callback(res, rows);
                    }
                    resolve (rows);
                }
            });
        })
    }
}

module.exports = {
    db
}