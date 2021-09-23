const express = require(`express`);
const router = express.Router({ mergeParams: true });
const service = require(`../services/metrics`);

router.get(`/`, async function (req, res, next) {
  service.fetchGeneralMetrics(res);
});

router.get(`/student`, async function (req, res, next) {
  service.fetchStudentMetrics(res);
});

router.get(`/class`, async function (req, res, next) {
  service.fetchClassMetrics(res);
});

module.exports = router;