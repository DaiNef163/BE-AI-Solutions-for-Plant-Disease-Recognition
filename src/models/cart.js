const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const CartSchema = new Schema(
  {
    amount: { type: Number, default: 0 },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);

CartSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
});

module.exports = mongoose.model("Cart", CartSchema);
