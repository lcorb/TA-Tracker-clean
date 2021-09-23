const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/aide`);

router.post(`/`, function(req, res) {
    service.createAideClass(res, {'mis': req.body.mis, 'id': req.body.id});
});

module.exports = router;