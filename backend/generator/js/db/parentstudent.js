class ParentStudent {
    constructor (db) {
        this.db = db;
    }

    async init () {
        const sql = `CREATE TABLE IF NOT EXISTS parentstudent (
            parent_id INTEGER,
            eqid TEXT,
            PRIMARY KEY (parent_id, eqid),
            FOREIGN KEY (parent_id)
                REFERENCES parents (parent_id),
            FOREIGN KEY (eqid)
                REFERENCES students (eqid)
            )`;
        return this.db.run(sql);
    }

    create (db, parent_id, eqid) {
        return db.run (
            `INSERT OR IGNORE INTO parentstudent (
                parent_id,
                eqid) 
                VALUES(?, ?)`,
            [parent_id, eqid])
    }
}

module.exports = {
    ParentStudent
}