class AideClass {
    constructor (db) {
        this.db = db;
    }

    async init () {
        return this.db.run(
            `CREATE TABLE IF NOT EXISTS aideclass (
                aide_mis TEXT NOT NULL,
                class_id TEXT NOT NULL,
                PRIMARY KEY (aide_mis, class_id),
                FOREIGN KEY (aide_mis)
                    REFERENCES aides (mis),
                FOREIGN KEY (class_id)
                    REFERENCES class (code)
            )`)
    }

    create (aide_mis, class_id, call, res) {
        return this.db.run (
            `INSERT INTO aideclass (
                aide_mis,
                class_id)                
                VALUES(?, ?)`,
            [aide_mis, class_id], call, res)
    }

    delete (aide_mis, class_id, call, res) {
        return this.db.run (
            `DELETE FROM aideclass 
            WHERE aide_mis = ? AND class_id = ?`,
            [aide_mis, class_id], call, res)
    }
}

module.exports = {
    AideClass
}