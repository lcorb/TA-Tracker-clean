const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/aide`);

router.delete(`/`, function(req, res) {
    service.deleteAideClass(res, {'mis': req.params.mis, 'id': req.params.id});
});

module.exports = router;