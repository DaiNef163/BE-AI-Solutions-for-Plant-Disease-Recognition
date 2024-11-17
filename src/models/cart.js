const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const ProductItemSchema = new Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
    quantity: { type: Number, required: true, min: 1 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    quantity: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "Account", unique: true },
    products: { type: [ProductItemSchema], default: [] },
    totalCost:{type: Number, default:0}
  },
  { timestamps: true }
);

CartSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
});

CartSchema.index({ owner: 1 }, { unique: true });

module.exports = mongoose.model("Cart", CartSchema);
