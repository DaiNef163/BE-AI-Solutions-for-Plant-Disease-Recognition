const Cart = require("../models/cart");
const Products = require("../models/product");
const Purchases = require("../models/purchases");

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
    cart.products = cart.products.filter((item) => {
      if (!item.productId) {
        item.deleted = true;
        return false;
      }
      return true;
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

    console.log(cart);
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Có lỗi xảy ra khi lấy giỏ hàng" });
  }
};

module.exports.updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  if (!productId || quantity <= 0) {
    return res.status(400).json({ message: "Thông tin không hợp lệ." });
  }

  try {
    let cart = await Cart.findOne({ owner: userId });

    if (!cart) {
      cart = new Cart({ owner: userId, products: [] });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      cart.products.push({ productId, quantity });
    } else {
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ owner: userId }).populate({
      path: "products.productId",
      select: "productName price images description discount",
    });

    return res.json(updatedCart);
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

module.exports.saveOrderHistory = async (cartId, userInfo) => {
  // Kiểm tra xem thông tin người dùng có hợp lệ không
  if (
    !userInfo ||
    !userInfo._id ||
    !userInfo.name ||
    !userInfo.address ||
    !userInfo.phone
  ) {
    throw new Error("Thông tin người dùng không hợp lệ.");
  }

  try {
    // Truy vấn giỏ hàng và populate thông tin sản phẩm
    const cart = await Cart.findById(cartId).populate("products.productId");

    // Kiểm tra xem giỏ hàng có tồn tại và có sản phẩm không
    if (!cart || !Array.isArray(cart.products) || cart.products.length === 0) {
      throw new Error("Giỏ hàng không có sản phẩm.");
    }

    // Tạo đối tượng đơn hàng
    const order = {
      user: userInfo._id, // ID người dùng
      name: userInfo.name,
      address: userInfo.address,
      phone: userInfo.phone,
      products: cart.products.map((item) => ({
        productId: item.productId._id, // ID sản phẩm
        name: item.productId.productName,
        quantity: item.quantity,
        price: item.productId.price,
        discount: item.productId.discount || 0,
      })),
      totalCost: cart.totalCost,
      discountAmount: cart.discountAmount,
      status: "pending", // Trạng thái đơn hàng (mới tạo)
      createdAt: new Date(),
    };

    // Giả sử bạn có một mô hình Mongoose Order
    const newOrder = new Purchases(order);

    // Lưu đơn hàng vào cơ sở dữ liệu
    await newOrder.save();

    // Trả về đối tượng đơn hàng vừa lưu
    return newOrder;
  } catch (error) {
    console.error("Lỗi khi lưu đơn hàng:", error);
    throw new Error("Không thể lưu đơn hàng.");
  }
};

module.exports.clearCart = async (userId) => {
  try {
    await Cart.deleteOne({ owner: userId });
    console.log("Giỏ hàng đã được xóa.");
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
  }
};
