const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/aide`);

router.delete(`/`, function(req, res) {
    service.deleteAide(res, req.params.mis);
});

module.exports = router;