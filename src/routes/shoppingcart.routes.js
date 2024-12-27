const express = require("express");
const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
  removeItem,
} = require("../controllers/cart.controller");
const auth = require("../middleware/authAdmin");
const router = express.Router();

router.post("/addtocart", auth.requireAuth, addToCart);

router.get("/viewcart", auth.requireAuth, getCart);
router.put("/update", auth.requireAuth, updateCartQuantity);
router.delete("/remove-item/:productId", auth.requireAuth, removeItem);

module.exports = router;
