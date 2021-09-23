const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/class`);

router.get(`/`, function(req, res, next) {
  service.fetchClassesFromYear(res, req.params.year);
});

module.exports = router;

