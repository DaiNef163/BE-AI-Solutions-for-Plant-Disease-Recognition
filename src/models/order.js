const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const OrderSchema = new Schema(
  {
    amount: { type: Number, default: 0 },
    paymentType: { type: Number, default: 0, enums: [0, 1] }, // 0 la thanh toan khi nhan hang, 1 la thanh toan truc tuyen
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },

  },
  { timestamps: true }
);

OrderSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
});

module.exports = mongoose.model("Order", OrderSchema);
