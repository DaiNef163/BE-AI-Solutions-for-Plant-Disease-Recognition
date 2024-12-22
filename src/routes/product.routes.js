const express = require("express");
const multer = require("multer");
const storageMulter = require("../helper/storageMulter");
const upload = multer({ storage: storageMulter });
const router = express.Router();
const auth = require("../middleware/authAdmin");
const {
  createProduct,
  viewProduct,
  detailProduct,
  editProduct,
  getProduct,
  deleteProduct,
  viewProductUser,
} = require("../controllers/product.controller");
const Product = require("../models/product");

// router.get("/", productController.getAll);

router.get("/view", viewProduct);
router.get("/maganeview", auth.requireAuth, viewProductUser);
router.get("/detail/:id", detailProduct);
router.post("/create", auth.requireAuth, createProduct);
router.get("/editproduct/:id", auth.requireAuth, getProduct);
router.post("/editproduct", auth.requireAuth, editProduct);
router.get("/deleteproduct/:id", auth.requireAuth, getProduct);
router.delete("/deleteproduct/:id", auth.requireAuth, deleteProduct);

// router.get("/admin",auth.requireAuth,productController.productAdmin)
// router.patch("/accept/:id",auth.requireAuth,productController.acceptProduct)
// router.delete("/unaccept/:id",auth.requireAuth,productController.unacceptProduct)
// router.get("/detail/:id",productController.Detail)
// router.patch("/update/:id",auth.requireAuth,upload.array('images'),productController.updateProduct)
// router.delete("/delete/:id",auth.requireAuth,productController.deleteProduct)
module.exports = router;
