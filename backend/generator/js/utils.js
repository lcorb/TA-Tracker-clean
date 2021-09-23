const fs = require('fs');

function getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dayOfWeek];
}

function find(dir, type) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, function (e, files) {
            if (e) throw e;
            files.forEach((v) => {
                if (v.startsWith(type) && v !== 'archive') {
                    resolve(dir + '/' + v);
                }
            });
        });
    });
}

function archive(file, new_location) {
    return new Promise((resolve, reject) => {
        fs.rename(file, new_location, (e) => {
            if (e) throw e;
            resolve();
        })
    })
}

module.exports = { getDayOfWeek, find, archive }