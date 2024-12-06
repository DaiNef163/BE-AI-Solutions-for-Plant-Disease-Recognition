const ProductsBuys = require("../models/productBuy");
const Cart = require("../models/cart")
const purchases = require("../models/purchases")
const axios = require('axios').default; 
const CryptoJS = require('crypto-js'); 
const moment = require('moment'); 
const qs = require('qs');

module.exports.createPay = async function (req, res) {
  try {
    var ProductsBuy = await ProductsBuys.findOne({userId: req.user._id})

  
    const transID = Math.floor(Math.random() * 1000000);
    const embed_data = {
      redirecturl: 'http://localhost:5173/', // Link sau khi thanh toán thành công
    };

    const order = {
      app_id: process.env.APP_ID,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, 
      app_user: ProductsBuy.userId,
      app_time: Date.now(), 
      item: JSON.stringify(ProductsBuy.productName), 
      embed_data: JSON.stringify(embed_data), 
      amount: ProductsBuy.totalCost,
      callback_url: 'https://8713-1-54-247-155.ngrok-free.app/payment/callback', 
      description: `Lazada - Payment for the order #${transID}`, 
      bank_code: '', 
    };

    
    const data =
      process.env.APP_ID +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item ;

    
    order.mac = CryptoJS.HmacSHA256(data, process.env.KEY1).toString();

    // Gửi yêu cầu thanh toán đến Zalopay
    const result = await axios.post(process.env.ENDPOINT, null, { params: order });

    console.log("...."+result.data.order_url)

    return res.status(200).json(result.data.order_url);

  } catch (error) {
    console.error("Error during payment request:", error);
    return res.status(500).json({ message: "An error occurred while processing the payment request." });
  }
};

/**
   * description: callback để Zalopay Server call đến khi thanh toán thành công.
   * Khi và chỉ khi ZaloPay đã thu tiền khách hàng thành công thì mới gọi API này để thông báo kết quả.
   */
module.exports.callBack= async function (req,res) {
    let result = {};
    
    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;
  
      let mac = CryptoJS.HmacSHA256(dataStr, process.env.KEY2).toString();
      console.log('mac =', mac);
  
      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = 'mac not equal';
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng ở đây
        let dataJson = JSON.parse(dataStr, process.env.KEY2);
        const itemjs = JSON.parse(dataJson.item);
        const info = await ProductsBuys.findOne({userId:dataJson.app_user}).select("info")
        console.log(info)
        const productObject = {
          userId:dataJson.app_user,
          paymentId:dataJson.app_trans_id,
          productName: itemjs,
          totalCost:dataJson.amount,
          info: {
            address: info.info.address,
            phone: info.info.phone
          }
        }
        const product = new purchases(productObject)
        await product.save()
        await ProductsBuys.deleteOne({userId:dataJson.app_user})
        console.log(
          "update order's status = success where app_trans_id =",
          dataJson['app_trans_id'],
        );
  
        result.return_code = 1;
        result.return_message = 'success';
      }
    } catch (ex) {
      console.log('lỗi:::' + ex.message);
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }
  
    // thông báo kết quả cho ZaloPay server
    res.json(result);
}