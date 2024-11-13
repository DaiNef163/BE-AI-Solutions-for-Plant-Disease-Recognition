const express = require("express");
const multer = require("multer");
const storageMulter = require("../helper/storageMulter");
const upload = multer({ storage: storageMulter });
const router = express.Router();
const auth = require("../middleware/authAdmin");
const productController = require("../controllers/admin/productController");
const {
  createProduct,
  viewProduct,
  detailProduct,
} = require("../controllers/product.controller");
const Product = require("../models/product");

// router.get("/", productController.getAll);

router.get("/view", viewProduct);
router.get("/detail/:id", detailProduct);
router.post("/create", auth.requireAuth, createProduct);
router.get("/phantrang", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Trang hiện tại
  const limit = parseInt(req.query.limit) || 4; // Số sản phẩm mỗi trang
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// router.get("/admin",auth.requireAuth,productController.productAdmin)
// router.patch("/accept/:id",auth.requireAuth,productController.acceptProduct)
// router.delete("/unaccept/:id",auth.requireAuth,productController.unacceptProduct)
// router.get("/detail/:id",productController.Detail)
// router.patch("/update/:id",auth.requireAuth,upload.array('images'),productController.updateProduct)
// router.delete("/delete/:id",auth.requireAuth,productController.deleteProduct)
module.exports = router;
