const Cart = require("../models/cart");
const Products = require("../models/product");

exports.addToCart = async (req, res) => {
  console.log("User role:", req.user.role);

  if (
    req.user.role !== "customer" &&
    req.user.role !== "admin" &&
    req.user.role !== "staff"
  ) {
    return res.status(403).json({
      code: 403,
      message: "Bạn không có quyền này",
    });
  }

  try {
    const { productId, quantity } = req.body;
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: "Sản phẩm không tồn tại",
      });
    }

    let cart = await Cart.findOne({ owner: req.user._id });

    if (!cart) {
      cart = new Cart({ owner: req.user._id, products: [] });
    }
    if (!Array.isArray(cart.products)) {
      cart.products = [];
    }

    const existingItem = cart.products.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    // Kiểm tra sản phẩm đã bị xóa chưa
    cart.products = cart.products.map(item => {
      if (!item.productId) {
        item.deleted = true;  // Đánh dấu sản phẩm đã xóa
      }
      return item;
    });

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Lỗi khi thêm sản phẩm vào giỏ hàng",
      error: err.message || err,
    });
  }
};


exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ owner: userId }).populate({
      path: "products.productId",
      select: "productName price images description discount",
    });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tìm thấy" });
    }
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Có lỗi xảy ra khi lấy giỏ hàng" });
  }
};
