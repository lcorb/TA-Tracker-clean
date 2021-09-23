const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/students`);

router.get(`/`, function(req, res) {
  service.fetchStudentClasses(res, req.params.eqid);
});

module.exports = router;