const express = require(`express`);
const router = express.Router({mergeParams : true});
const service = require(`../services/class`);

router.get(`/`, function(req, res, next) {
  service.fetchClassesFromStaffCode(res, req.params.staff_code);
});

module.exports = router;