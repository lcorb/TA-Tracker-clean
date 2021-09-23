const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/aide`);

router.post(`/`, function(req, res) {
    service.create(res, {'mis': req.body.mis, 'firstname': req.body.firstname, 'lastname': req.body.lastname});
});

module.exports = router;