const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/class`);

router.get(`/`, function(req, res) {
  service.fetchParents(res, req.params.code);
});

module.exports = router;