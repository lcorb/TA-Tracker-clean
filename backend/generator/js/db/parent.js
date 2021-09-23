class Parent {
    constructor (db) {
        this.db = db;
    }

    async init () {
        const sql = `CREATE TABLE IF NOT EXISTS parents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lastname TEXT,
            firstname TEXT,
            email TEXT,
            UNIQUE (lastname, firstname, email) ON CONFLICT IGNORE)
            `;
        return this.db.run(sql);
    }

    create (lastname, firstname, email, eqid) {
        let next = this.db.parentStudentEntry.create;
        return this.db.runChain(
            `INSERT or IGNORE INTO parents (
                lastname,
                firstname,
                email)
                VALUES(?, ?, ?)`,
            [lastname, firstname, email], next, [eqid]);
    }

    bulkCreate(values) {
        const m = values.map(v => `("${v.Parent_Family_Name}","${v.Parent_Given_Name}","${v.Contact_Detail}")`)
        const joined = m.join(',');
        return this.db.run(
            `REPLACE INTO parents VALUES ${joined}`
        )
    }
}

module.exports = {
    Parent
}