const Order = require("../models/order");
const Purchases = require("../models/purchases");
const Cart = require("../models/cart");
const Product = require("../models/product");
const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const { reduceProductQuantity } = require("./product.controller");

module.exports.createPay = async (req, res) => {
  const { userInfo, cart } = req.body;
  //console.log("Kiểm tra userInfo:", userInfo);
  const userId = req.user._id;
  const paymentMethod = "Tiền mặt";
  const totalCost = cart.totalCost;
  //console.log("Thông tin người nhận:", userInfo);
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
    const transID = Math.floor(Math.random() * 1000000);

    const purchase = {
      userId: userId,
      paymentId: `${moment().format("YYMMDD")}_${transID}`,
      productName: productsWithPrice,
      totalCost: totalCost,
      info: {
        name: userInfo.name,
        phone: userInfo.phone,
        address: userInfo.address,
      },
      paymentType: paymentMethod,
    };

    const createPurchase = new Purchases(purchase);
    await createPurchase.save();

    await Cart.updateOne({ owner: userId }, { products: [] });

    return res.status(200).json("Tao don hang thanh cong");
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    return res.status(500).json({ message: "Lỗi khi thanh toán" });
  }
};

module.exports.createOnlinePayment = async (req, res) => {
  try {
    const { userInfo, cart } = req.body;
    const totalCost = cart.totalCost;

    // Step 1: Kiểm tra xem tất cả sản phẩm có đủ số lượng hay không
    const productsWithPrice = await Promise.all(
      cart.products.map(async (item) => {
        const product = await Product.findById(item.productId);
        
        // Kiểm tra số lượng sản phẩm
        if (product.quantity < item.quantity) {
          return { success: false, message: `Không đủ số lượng sản phẩm: ${product.productName}. Số lượng còn lại: ${product.quantity}` };
        }

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    // Kiểm tra nếu có lỗi trong việc kiểm tra số lượng
    const error = productsWithPrice.find(item => item.success === false);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Step 2: Tiếp tục với việc tạo đơn hàng nếu tất cả sản phẩm đủ số lượng
    const embed_data = {
      redirecturl: "http://localhost:5173/product",
      additionalInfo: userInfo,
    };

    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: process.env.APP_ID,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: req.user.id,
      app_time: Date.now(),
      item: JSON.stringify(productsWithPrice),
      embed_data: JSON.stringify(embed_data),
      amount: totalCost,
      callback_url: "https://c7b5-2001-ee0-4b6f-c8a0-50b3-eb6d-72e0-acff.ngrok-free.app/payment/callBack",
      description: `Payment for the order #${transID}`,
      bank_code: "",
    };

    const data = process.env.APP_ID + "|" +
                 order.app_trans_id + "|" +
                 order.app_user + "|" +
                 order.amount + "|" +
                 order.app_time + "|" +
                 order.embed_data + "|" +
                 order.item;
    order.mac = CryptoJS.HmacSHA256(data, process.env.KEY1).toString();

    const result = await axios.post(process.env.ENDPOINT, null, {
      params: order,
    });

    console.log(result.data);
    return res.status(200).json(result.data.order_url);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: 'Có lỗi xảy ra trong quá trình thanh toán.' });
  }
};





module.exports.callBack = async function (req, res) {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, process.env.KEY2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng ở đây
      let dataJson = JSON.parse(dataStr, process.env.KEY2);
      const itemjs = JSON.parse(dataJson.item);
      const embedData = JSON.parse(dataJson.embed_data);
      console.log("info:", embedData);
      const productObject = {
        userId: dataJson.app_user,
        paymentId: dataJson.app_trans_id,
        productName: itemjs,
        totalCost: dataJson.amount,
        info: embedData.additionalInfo,
        paymentType: "Thanh toan ZaloPay",
      };
      const product = new Purchases(productObject);
      await product.save();
      await Cart.updateOne({ owner: dataJson.app_user }, { products: [] });
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );
      for (const productItem of itemjs) {
        const { productId, quantity } = productItem;
        await reduceProductQuantity(productId, quantity);
      }

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    console.log("lỗi:::" + ex.message);
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};
