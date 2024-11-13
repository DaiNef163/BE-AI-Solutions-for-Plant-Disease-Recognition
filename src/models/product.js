const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const { schema } = require("./postNews");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Products = new Schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    description: { type: String, required: true },
    discount: { type: Number, default: 0 },
    images: { type: [String] },
    nameLeaf: { type: String, required: true, ref: "nameLeaf" },
    accept: { type: Boolean, default: false },
    slug: {
      type: String,
      slug: "productName",
      unique: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Products", Products, "products");
