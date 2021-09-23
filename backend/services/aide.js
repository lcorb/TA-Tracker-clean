const call = require(`../routes/handle`);

async function fetchAllAides(res) {
    const api = require(`../server`);
    api.database.all(`
    SELECT *
    FROM aides
    `, [], call, res);
}

async function fetch(res, mis) {
    const api = require(`../server`);
    api.database.get(`
    SELECT *
    FROM aides
    WHERE mis = ?
    `, mis, call, res);
}

async function create(res, payload) {
    const api = require(`../server`);
    api.database.aideEntry.create(payload.mis, payload.lastname, payload.firstname, call, res);
}

async function deleteAide(res, mis) {
    const api = require(`../server`);
    api.database.aideEntry.delete(mis, call, res);
}

async function createAideClass(res, data) {
    const api = require(`../server`);
    api.database.aideClassEntry.create(data.mis, data.id, call, res);
}

async function deleteAideClass(res, data) {
    const api = require(`../server`);
    api.database.aideClassEntry.delete(data.mis, data.id, call, res);
}

module.exports = {fetchAllAides, fetch, create, deleteAide, createAideClass, deleteAideClass};