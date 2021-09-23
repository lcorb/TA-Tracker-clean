class Timetable {
    constructor (db) {
        this.db = db;
    }

    async init () {
        return this.db.run(
            `CREATE TABLE IF NOT EXISTS timetable (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_code TEXT NOT NULL,
            day TEXT NOT NULL,
            period TEXT NOT NULL,
            FOREIGN KEY (class_code)
                REFERENCES class (code))`
        )
    }

    create (timeData, code) {
        const keys = Object.keys(timeData);
        const flatTimeData = [];
        keys.forEach(v => {
            flatTimeData.push(timeData[v]);
        })
        let values = '';
        flatTimeData.forEach((v, i) => {
            values+= `("${code}", "${v[0]}","${v[1]}")${i < flatTimeData.length-1 ? ',' : ''}`
        })
        return this.db.run (
            `REPLACE INTO timetable (
                class_code,
                day,
                period)
                VALUES ${values}`,
            [])
    }

    update (id, cols, ...data) {
        const valuesToUpdate = cols.map((v, i) => `${v} = ?` + (i > 0 ? `,`: ``));

        return this.db.run (
            `UPDATE timetable
            SET ${valuesToUpdate}
            WHERE id = ?`,
            [...data, id]
        )
    }
}

module.exports = {
    Timetable
}