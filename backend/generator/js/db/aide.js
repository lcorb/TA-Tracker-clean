class Aide {
    constructor (db) {
        this.db = db;
    }

    async init () {
        return this.db.run(
            `CREATE TABLE IF NOT EXISTS aides (
            mis TEXT PRIMARY KEY NOT NULL UNIQUE,
            lastname TEXT,
            firstname TEXT
            )`)
    }

    create (mis, lastname, firstname, call, res) {
        return this.db.run (
            `REPLACE INTO aides (
                mis,
                lastname,
                firstname)                
                VALUES(?, ?, ?)`,
            [mis, lastname, firstname], call, res)
    }

    delete (mis, call, res) {
        return this.db.run (
            `DELETE FROM aides
            WHERE mis = ?`,
            [mis], call, res)
    }

    update (mis, cols, ...data) {
        const valuesToUpdate = cols.map((v, i) => `${v} = ?` + (i > 0 ? `,`: ``));

        return this.db.run (
            `UPDATE aides
            SET ${valuesToUpdate}
            WHERE mis = ?`,
            [...data, mis]
        )
    }
}

module.exports = {
    Aide
}