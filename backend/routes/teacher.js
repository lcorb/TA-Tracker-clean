const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/teachers`);

router.get(`/`, function(req, res, next) {
  service.fetch(res, req.params.mis);
});

module.exports = router;
