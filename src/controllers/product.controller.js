const { default: mongoose } = require("mongoose");
const Products = require("../models/product");
const {
  uploadSingleFile,
  uploadMultipleFile,
} = require("../services/fileServiceUpload.service");
const { faker } = require("@faker-js/faker");
const path = require("path");

const createProduct = async (req, res) => {
  console.log("User role:", req.user.role);

  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({
      code: 403,
      message: "Bạn không có quyền này",
    });
  }

  try {
    let { productName, price, description, discount, accept, slug, nameLeaf } =
      req.body;
    let imageURL = "";
    console.log(req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Không có tệp nào được tải lên" });
    }

    let resultsArr = [];
    resultsArr = await uploadSingleFile(req.files.images);

    console.log(resultsArr);

    if (Array.isArray(resultsArr)) {
      imageURL = resultsArr.map((result) => result.path).filter((path) => path);
      if (imageURL.length === 0) {
        return res
          .status(500)
          .json({ message: "Không có ảnh hợp lệ nào được tải lên" });
      }
    } else {
      console.error("resultsArr is not an array:", resultsArr);
      return res.status(500).json({ message: "Lỗi trong quá trình tải ảnh" });
    }
    const nameLeafValue = nameLeaf.trim();
    let product = await Products.create({
      productName,
      price,
      description,
      discount,
      images: imageURL,
      accept,
      slug,
      nameLeaf: nameLeafValue,
    });

    res.json(product);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Tạo sản phẩm thất bại", error: error.message });
  }
};

const viewProduct = async (req, res) => {
  try {
    const product = await Products.find({});
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const nameLeaf = async (req, res) => {
  try {
    const products = await Products.distinct("nameLeaf");
    res.json(products);
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
};

const detailProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("checkk", productId);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editProduct = async (req, res) => {
  const productId = req.params.id;

  const { productName, price, description, discount, nameLeaf } = req.body;
  const images = req.file?.path;
  console.log("check productId", productId);

  try {
    const updateData = {
      productName,
      price,
      description,
      discount,
      nameLeaf,
      images,
    };
    if (images) updateData.images = images;

    await Products.updateOne(updateData);
    res.status(200).json({ message: "Sản phẩm đã được cập nhật." });
    console.log(updateData);
  } catch (error) {
    res.status(500).json({ message: "Cập nhật sản phẩm thất bại.", error });
  }
};
const getProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Lấy thông tin sản phẩm thất bại.", error });
  }
};
const deleteProduct = async (req, res) => {
  let productId = req.params.id;
  try {
    await Products.deleteOne(productId);
    res.json(productId);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createProduct,
  viewProduct,
  nameLeaf,
  detailProduct,
  editProduct,
  getProduct,
  deleteProduct,
};
