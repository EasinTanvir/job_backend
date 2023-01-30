const express = require("express");
const router = express.Router();
const jobContrl = require("../controllers/jobController");
const protectRoutes = require("../helper/protectRoutes");

router.route("/").post(protectRoutes, jobContrl.createJobs);
router.route("/").get(jobContrl.getJobs);
router.route("/:id").get(jobContrl.findJobsById);
router.route("/post/job").get(protectRoutes, jobContrl.getPostJobs);
router
  .route("/post/job/applyuser/:id")
  .get(protectRoutes, jobContrl.getApplyUserDetails);
router.route("/location/:location").get(jobContrl.findJobsByLocation);

module.exports = router;
