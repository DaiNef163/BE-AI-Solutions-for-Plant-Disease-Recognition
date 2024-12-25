const express = require("express");
const router = express.Router();
const Purchase = require("../controllers/purchase.controller");
const auth = require("../middleware/authAdmin")

router.get("/view",auth.requireAuth,Purchase.getAll);
router.get("/detail/:id",auth.requireAuth,Purchase.getDetail)
module.exports = router