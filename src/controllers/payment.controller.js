const Order = require("../models/order");
const Product = require("../models/product");
const { saveOrderHistory, clearCart } = require("./cart.controller");
const { v4: uuidv4 } = require("uuid");

module.exports.createPay = async (req, res) => {
  const { userInfo, cart } = req.body;
  console.log("Kiểm tra userInfo:", userInfo);
  const userId = req.user._id;
  const paymentMethod = "Tiền mặt";
  const totalCost = cart.totalCost;

  console.log("Thông tin người nhận:", userInfo);
  console.log("Thông tin giỏ hàng:", cart);

  if (!userInfo || !userInfo.name || !userInfo.phone || !userInfo.address) {
    return res
      .status(400)
      .json({ message: "Thông tin người dùng không đầy đủ." });
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return res
      .status(400)
      .json({ message: "Giỏ hàng trống, không thể thanh toán." });
  }

  try {
    const productsWithPrice = await Promise.all(
      cart.products.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const order = new Order({
      amount: totalCost,
      paymentType: 0,
      userId: userId,
      products: productsWithPrice,
      name: userInfo.name,
      address: userInfo.address,
      phoneNumber: userInfo.phone,
      transactionId: uuidv4(),
    });

    await order.save();

    await saveOrderHistory(userId, cart, paymentMethod);

    await clearCart(userId);

    return res
      .status(200)
      .json({ message: "Thanh toán thành công khi nhận hàng" });
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    return res.status(500).json({ message: "Lỗi khi thanh toán" });
  }
};

// Phương thức thanh toán trực tuyến
module.exports.createOnlinePayment = async (req, res) => {
  const userId = req.user._id; // Lấy userId từ JWT
  const cart = req.body.cart; // Lấy thông tin giỏ hàng từ body
  const paymentMethod = "Thanh toán trực tuyến"; // Phương thức thanh toán trực tuyến
  const amount = cart.totalCost; // Tổng tiền trong giỏ hàng

  try {
    // Tạo đơn hàng với thanh toán trực tuyến
    const order = new Order({
      amount: amount,
      paymentType: 0, // 0: Thanh toán khi nhận hàng
      userId: userId,
      productId: cart.products.map((item) => item.productId._id), // Lấy ID sản phẩm từ mỗi item
      name: cart.userInfo.name,
      address: cart.userInfo.address,
      phoneNumber: cart.userInfo.phone,
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await order.save();

    // Giả sử bạn tích hợp thanh toán trực tuyến (ví dụ MoMo, ZaloPay)
    // Ở đây sẽ có một phần gọi API thanh toán bên ngoài và nhận lại kết quả

    // Giả sử thanh toán thành công, cập nhật trạng thái thanh toán
    order.paymentStatus = "paid";
    await order.save();

    // Lưu lịch sử mua hàng
    await saveOrderHistory(userId, cart, paymentMethod);

    // Xóa giỏ hàng
    await clearCart(userId);

    return res
      .status(200)
      .json({ message: "Thanh toán trực tuyến thành công" });
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    return res.status(500).json({ message: "Lỗi khi thanh toán" });
  }
};
