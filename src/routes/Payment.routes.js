const express = require("express");
const router = express.Router();
const Payment = require("../controllers/payment.controller");
const auth = require("../middleware/authAdmin"); // Middleware kiểm tra quyền admin (nếu cần)

router.post("/cash", auth.requireAuth, Payment.createPay);

router.post("/online", auth.requireAuth, Payment.createOnlinePayment);

router.post("/callBack", Payment.callBack)

module.exports = router;
