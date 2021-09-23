// There are glaring database design issues present in the 'timetable' column
// this column contains duplicated data, and is formed in JSON.
// The data is duplicated in the 'timetable' table.
// This column is maintained as this was the intial implementation and thus many other areas
// will need refactoring if this columnn is removed.
// In any case, since timetable data is not directly modified (it is only generated using OneSchool data)
// there should be no real harm in maintaining it, as it will always be the same as the duplicated table

const { json } = require("express");

class BSDEClass {
    constructor (db) {
        this.db = db;
    }

    async init () {
        const sql = [
            `CREATE TABLE IF NOT EXISTS class (
            code TEXT PRIMARY KEY NOT NULL UNIQUE,
            subject TEXT NOT NULL,
            year TEXT NOT NULL,
            staff_code TEXT,
            timetable TEXT,
            students TEXT,
            last_modified TEXT,
            FOREIGN KEY (staff_code)
                REFERENCES teachers (mis))`,
        `CREATE TRIGGER IF NOT EXISTS set_last_modified_class
        AFTER UPDATE
        ON class
        BEGIN
        UPDATE class SET last_modified = CURRENT_TIMESTAMP WHERE code = old.code;
        END`]
        return this.db.runMultiple(sql);
    }

    create (code, subject, year, staff_code, timetable = {}, students = null) {
        return this.db.run (
            `REPLACE INTO class (
                code,
                subject,
                year,
                staff_code,
                timetable,
                students)                
                VALUES(?, ?, ?, ?, json(?), ?)`,
            [code, subject, year, staff_code, timetable, students])
    }

    update (cols, data) {
        const valuesToUpdate = cols.map((v, i) => `${v}=${String(data[i]).startsWith('{') ? 'json(\'' + data[i] + '\')' : "'" + data[i] + "'"}`);

        return this.db.run (
            `INSERT INTO class (
                code,
                subject,
                year,
                staff_code,
                timetable,
                students)                
            VALUES(?, ?, ?, ?, json(?), ?)
            ON CONFLICT(code) DO UPDATE 
            SET ${valuesToUpdate}`,
            data
        )
    }

    updateStudents (code, cols, ...data) {
        const valuesToUpdate = cols.map((v, i) => `${v}=?` + (i > 0 ? `,`: ``));

        return this.db.run (
            `UPDATE class
            SET ${valuesToUpdate}
            WHERE code = ?`,
            [...data, code]
        )
    }
}

module.exports = {
    BSDEClass
}