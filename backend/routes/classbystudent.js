const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/class`);

router.get(`/`, async function(req, res, next) {
  service.fetchClassesByStudent(res, req.params.eqid);
});

module.exports = router;
