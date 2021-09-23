class student {
    constructor (db) {
        this.db = db;
    }

    async init () {
        const sql = [`
        CREATE TABLE IF NOT EXISTS students (
            eqid TEXT PRIMARY KEY NOT NULL UNIQUE,
            studentname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            firstname TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT,
            roll TEXT,
            grade INTEGER,
            indigenous TEXT,
            mis TEXT,
            aims INTEGER,
            active TEXT,
            departure_date TEXT,
            last_modified TEXT)`,
        `CREATE TRIGGER IF NOT EXISTS set_last_modified_students
        AFTER UPDATE
        ON students
        FOR EACH ROW
        BEGIN
        UPDATE students SET last_modified = CURRENT_TIMESTAMP WHERE eqid = old.eqid;
        END`
        ]
        return this.db.runMultiple(sql);
    }

    create (studentname, eqid, lastname, firstname, age, gender, roll, grade, indigenous, mis, aims = 0, active = 'Yes', departure_date = '') {
        return this.db.run (
            `REPLACE INTO students (
                studentname,
                eqid,
                lastname,
                firstname,
                age,
                gender,
                roll,
                grade,
                indigenous,
                mis,
                aims,
                active,
                departure_date)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [studentname, eqid, lastname, firstname, age, gender, roll, grade, indigenous, mis, aims, active, departure_date]
        )
    }

    update (eqid, cols, data) {
        const valuesToUpdate = cols.map((v, i) => `${v} = "${data[i]}"`);

        return this.db.run (
            `INSERT INTO students (
                eqid,
                studentname,
                lastname,
                firstname,
                age,
                gender,
                roll,
                grade,
                indigenous,
                mis,
                aims)
            VALUES ("${eqid}", ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(eqid) DO UPDATE 
            SET ${valuesToUpdate}`,
            data
        )
    }


    setBulkInactive(data) {
        const sql = Object.keys(data).map(v => `
        UPDATE students SET active = 'No', departure_date = '${data[v]}' WHERE eqid = '${v}'`);
        return this.db.runMultiple(sql);
    }
}

module.exports = {
    student
}