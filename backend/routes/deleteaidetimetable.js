const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/timetable`);

router.delete(`/`, function(req, res) {
    service.deleteAide(res, {
        code: req.body.code,
        mis: req.body.mis,
        period: req.body.period,
        day: req.body.day
    });
});

module.exports = router;