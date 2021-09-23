const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/aide`);

router.get(`/`, function(req, res) {
    service.fetchAllAides(res);
});

module.exports = router;