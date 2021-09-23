const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/aide`);

router.get(`/`, function(req, res) {
    service.fetch(res, req.params.mis);
});

module.exports = router;
