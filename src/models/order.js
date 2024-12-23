const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const OrderSchema = new Schema(
  {
    amount: { type: Number, default: 0 },
    paymentType: {
      type: Number,
      default: 0,
      enum: [0, 1], // 0: Thanh toán khi nhận hàng, 1: Thanh toán trực tuyến
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    transactionId: { type: String, unique: true },
  },
  { timestamps: true }
);

OrderSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
});

module.exports = mongoose.model("Order", OrderSchema);
