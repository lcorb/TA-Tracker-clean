class Log {
    constructor (db) {
        this.db = db;
    }

    async init () {
        return new Promise(resolve => {
            resolve(this.db.run(
                `CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT,
                content TEXT,
                date TEXT
                )`));
        })
    }

    create (type, content) {
        return this.db.run (
            `REPLACE INTO logs (
                type,
                content,                
                date)
                VALUES(?, ?, CURRENT_TIMESTAMP)`,
            [type, content])
    }
}

module.exports = {
    Log
}