class TimetableAide {
    constructor (db) {
        this.db = db;
    }

    async init () {
        return this.db.run(
            `CREATE TABLE IF NOT EXISTS timetableaide (
                timetable_id TEXT NOT NULL,
                aide_mis TEXT NOT NULL,
                PRIMARY KEY (timetable_id, aide_mis),
                FOREIGN KEY (timetable_id)
                    REFERENCES timetable (id),
                FOREIGN KEY (aide_mis)
                    REFERENCES aides (mis)
            )`)
    }

    create (timetable_id, aide_mis, call, res) {
        return this.db.run (
            `INSERT INTO timetableaide (
                timetable_id,                
                aide_mis)
                VALUES(?, ?)`,
            [timetable_id, aide_mis], call, res)
    }

    delete (timetable_id, aide_mis, call, res) {
        return this.db.run (
            `DELETE FROM timetableaide 
            WHERE timetable_id = ? AND aide_mis = ?`,
            [timetable_id, aide_mis], call, res)
    }
}

module.exports = {
    TimetableAide
}