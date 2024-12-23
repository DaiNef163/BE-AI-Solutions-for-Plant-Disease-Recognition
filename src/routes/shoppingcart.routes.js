const express = require("express");
const {
  addToCart,
  getCart,
  updateCartQuantity,
} = require("../controllers/cart.controller");
const auth = require("../middleware/authAdmin");
const router = express.Router();

router.post("/addtocart", auth.requireAuth, addToCart);

router.get("/viewcart", auth.requireAuth, getCart);
router.put("/update", auth.requireAuth, updateCartQuantity);

module.exports = router;
