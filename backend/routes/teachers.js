const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/teachers`);

router.get(`/`, function(req, res, next) {
  service.fetchAll(res);
});

module.exports = router;
