class StudentClass {
    constructor (db) {
        this.db = db;
    }

    async init () {
        return this.db.runMultiple([
            `CREATE TABLE IF NOT EXISTS studentclass (
                class_code TEXT NOT NULL,
                eqid TEXT NOT NULL,
                active TEXT,
                enrol_date TEXT,
                unenrol_date TEXT,
                PRIMARY KEY (class_code, eqid),
                FOREIGN KEY (class_code)
                    REFERENCES class (code),
                FOREIGN KEY (eqid)
                    REFERENCES students (eqid)
            )`,
            `CREATE TRIGGER IF NOT EXISTS set_enrol_date
            AFTER INSERT
            ON studentclass
            FOR EACH ROW
            BEGIN
            UPDATE studentclass SET enrol_date = CURRENT_TIMESTAMP WHERE class_code = new.class_code AND eqid = new.eqid AND enrol_date = null;
            END`])
    }

    create (class_code, eqid) {
        return this.db.run (
            `INSERT OR REPLACE INTO studentclass (
                class_code,                
                eqid,
                active)
                VALUES(?, ?, 'Yes')`,
            [class_code, eqid])
    }

    setInactive () {
        return this.db.run (
            `UPDATE studentclass
            SET active = 'No', unenrol_date = CURRENT_TIMESTAMP
            WHERE active = 'Yes'`,
            [])
    }
}

module.exports = {
    StudentClass
}