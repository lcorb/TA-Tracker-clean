// handle to be called when data is ready to be sent

function handle (res, data = null, errors = null) {
    if (errors) {
        res.json(errors);
    } else {
        res.header(`Content-Type`, `application/json`);
        res.send(data);
    }
};

module.exports = handle;