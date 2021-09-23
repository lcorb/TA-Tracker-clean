const call = require(`../routes/handle`);

async function createAide(res, data) {
    const api = require(`../server`);

    const createCallback = (res, row) => {
        api.database.timetableAideEntry.create(row.id, data.mis, call, res);
    }

    api.database.get(`
    SELECT id FROM timetable
    WHERE day = ? AND period = ? AND class_code = ?
    `, [data.day, data.period, data.code], createCallback, res);
}

async function deleteAide(res, data) {
    const api = require(`../server`);

    const deleteCallback = (res, row) => {
        api.database.timetableAideEntry.delete(row.id, data.mis, call, res);
    }

    api.database.get(`
    SELECT id FROM timetable
    WHERE day = ? AND period = ? AND class_code = ?
    `, [data.day, data.period, data.code], deleteCallback, res);
}

module.exports = { createAide, deleteAide }