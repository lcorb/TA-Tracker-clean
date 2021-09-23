class teacher {
    constructor (db) {
        this.db = db;
    }

    async init () {
        const sql = `CREATE TABLE IF NOT EXISTS teachers (
                mis TEXT PRIMARY KEY NOT NULL UNIQUE,
                lastname TEXT,
                firstname TEXT
            )`;
        return this.db.run(sql);
    }

    create (mis, lastname, firstname) {
        return this.db.run (
            `REPLACE INTO teachers (
                mis,
                lastname,
                firstname)                
                VALUES(?, ?, ?)`,
            [mis, lastname, firstname])
    }

    update (mis, ...data) {
        const valuesToUpdate = cols.map((v, i) => `${v} = ?` + (i > 0 ? `,`: ``));

        return this.db.run (
            `UPDATE teachers
            SET ${valuesToUpdate}
            WHERE mis = ?`,
            [...data, mis]
        )
    }
}

module.exports = {
    teacher
}