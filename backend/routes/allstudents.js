const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/students`);

router.get(`/`, async function(req, res, next) {
  service.fetchAll(res);
});

module.exports = router;
