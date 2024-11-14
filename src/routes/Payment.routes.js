const express = require("express");
const router = express.Router();
const Payment = require("../controllers/payment.controller");
const auth = require("../middleware/authAdmin")

router.post("/",auth.requireAuth,Payment.createPay);
router.post("/callback",Payment.callBack)

module.exports = router