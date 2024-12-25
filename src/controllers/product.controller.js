const { default: mongoose } = require("mongoose");
const Products = require("../models/product");
const {
  uploadSingleFile,
  uploadMultipleFile,
} = require("../services/fileServiceUpload.service");
const { faker } = require("@faker-js/faker");
const path = require("path");
const leaf = require("../models/leaf");

const createProduct = async (req, res) => {
  console.log("User role:", req.user?.role);
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({
      code: 403,
      message: "Bạn không có quyền này",
    });
  }

  try {
    const {
      productName,
      price,
      quantity,
      description,
      discount,
      accept,
      slug,
      nameLeaf,
    } = req.body;
    const tokenUser = req.user._id;
    let imageURL = [];

    console.log("Files received:", req.files);

    // Kiểm tra file tải lên
    if (!req.files?.images) {
      return res.status(400).json({ message: "Không có tệp nào được tải lên" });
    }

    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    // Gọi hàm uploadMultipleFile
    const resultsArr = await uploadMultipleFile(images);

    if (Array.isArray(resultsArr)) {
      imageURL = resultsArr.map((result) => result.path).filter(Boolean);

      if (imageURL.length === 0) {
        return res
          .status(500)
          .json({ message: "Không có ảnh hợp lệ nào được tải lên" });
      }
    } else {
      console.error("Error: resultsArr is not an array", resultsArr);
      return res.status(500).json({ message: "Lỗi trong quá trình tải ảnh" });
    }

    // Làm sạch và kiểm tra `nameLeaf`
    const nameLeafValue = nameLeaf?.trim() || "";

    const existingLeaf = await leaf.findOne({ nameLeaf: nameLeaf });
    if (!existingLeaf) {
      return res.status(400).json({ message: "Loại lá không hợp lệ" });
    }

    // Tạo sản phẩm mới
    const product = await Products.create({
      productName,
      price,
      description,
      quantity,
      discount,
      images: imageURL,
      accept,
      slug,
      nameLeaf: nameLeafValue,
      tokenUser: req.user.tokenUser,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);

    // Trả về lỗi chi tiết
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", error });
    }

    res
      .status(500)
      .json({ message: "Tạo sản phẩm thất bại", error: error.message });
  }
};

const viewProductUser = async (req, res) => {
  try {
    const tokenUser = req.user?.tokenUser; // Lấy tokenUser từ người dùng đã xác thực
    const userRole = req.user?.role; // Lấy role của người dùng

    if (!tokenUser) {
      return res.status(400).json({ message: "tokenUser is required" });
    }
    let products;
    if (userRole === "admin") {
      products = await Products.find({});
    } else {
      products = await Products.find({ tokenUser: tokenUser });
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
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

    // Sửa lại để thêm điều kiện tìm kiếm sản phẩm theo productId
    const result = await Products.updateOne(
      { _id: productId },
      { $set: updateData }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để cập nhật." });
    }

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
  const productId = req.params.id; // Get productId from URL parameter
  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const result = await Products.deleteOne({ _id: productId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully", productId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const reduceProductQuantity = async (productId, quantityToReduce) => {
  try {
    const product = await Products.findById(productId);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại.");
    }

    if (product.quantity < quantityToReduce) {
      throw new Error("Số lượng sản phẩm không đủ.");
    }

    product.quantity -= quantityToReduce; // Trừ số lượng
    await product.save();
    console.log(`Đã cập nhật số lượng sản phẩm: ${product.productName}`);
  } catch (error) {
    console.error("Lỗi khi trừ số lượng sản phẩm:", error.message);
    throw error;
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
  viewProductUser,
  reduceProductQuantity,
};
