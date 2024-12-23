const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Purchases = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    paymentId: String,
    productName: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
        quantity: Number,
      },
    ],
    totalCost: Number,
    info: {
      name: String,
      phone: String,
      address: String,
    },
    buyDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Purchases", Purchases, "purchases");
