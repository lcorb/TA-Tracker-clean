const call = require(`../routes/handle`);

async function fetch(res, mis) {
    const api = require(`../server`);
    api.database.get(`
    SELECT mis, lastname, firstname
    FROM teachers
    WHERE mis = ?
    `, mis, call, res);
}

async function fetchAll(res) {
    const api = require(`../server`);
    api.database.all(`
    SELECT mis, lastname, firstname
    FROM teachers
    `, [], call, res);
}

module.exports = {fetch, fetchAll};