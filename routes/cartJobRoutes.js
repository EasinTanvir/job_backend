const express = require("express");
const router = express.Router();
const cartJobCtrl = require("../controllers/CartJobCntrl");
const protectRoutes = require("../helper/protectRoutes");

router.route("/:id").post(protectRoutes, cartJobCtrl.addToCartJob);
router.route("/").get(protectRoutes, cartJobCtrl.getCartJob);
router.route("/:id").patch(protectRoutes, cartJobCtrl.update_CartJob);
router
  .route("/reject/:id")
  .patch(protectRoutes, cartJobCtrl.update_CartJobReject);

module.exports = router;
