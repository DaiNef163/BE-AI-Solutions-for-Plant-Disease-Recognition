const Products = require("../models/product");
const {
  uploadSingleFile,
  uploadMultipleFile,
} = require("../services/fileServiceUpload");
const { faker } = require("@faker-js/faker");
const path = require("path");

const createProduct = async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({
      code: 403,
      message: "Bạn không có quyền này",
    });
  }

  try {
    let { productName, price, description, discount, accept, slug } = req.body;
    let imageURL = [];

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("khong co file nao dc tai len");
    } else {
      let resultsArr = await uploadMultipleFile(req.files.images);
      console.log("Kết quả tải lên:", resultsArr); // In ra kết quả để kiểm tra
      if (Array.isArray(resultsArr)) {
        imageURL = resultsArr
          .map((result) => result.path)
          .filter((path) => path);
      } else {
        console.error("resultsArr is not an array:", resultsArr);
        return res
          .status(500)
          .json({ message: "Không có ảnh nào được tải lên" });
      }
    }

    let product = await Products.create({
      productName,
      price,
      description,
      discount,
      images: imageURL,
      accept,
      slug,
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



module.exports = { createProduct, viewProduct };
