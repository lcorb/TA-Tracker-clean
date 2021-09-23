const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/class`);

router.get(`/`, function(req, res, next) {
  service.fetchAllClasses(res);
});

module.exports = router;

