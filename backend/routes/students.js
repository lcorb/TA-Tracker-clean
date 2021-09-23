const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/students`);

router.get(`/`, function(req, res, next) {
  service.fetch(res, req.params.eqid);
});

module.exports = router;
