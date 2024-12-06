const express = require("express");
const router = express.Router();
const Order = require("../controllers/order.controller");
const auth = require("../middleware/authAdmin")


router.get("/", auth.requireAuth, Order.Order);


module.exports = router