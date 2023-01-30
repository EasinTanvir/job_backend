const express = require("express");
const router = express.Router();
const protectRoutes = require("../helper/protectRoutes");
const userCtrl = require("../controllers/userController");

router.route("/signup").post(userCtrl.SignUp);
router.route("/signin").post(userCtrl.SignIn);
router.route("/").get(protectRoutes, userCtrl.getuser);
router.route("/").patch(protectRoutes, userCtrl.updateUser);
module.exports = router;
