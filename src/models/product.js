const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const { schema } = require("./postNews");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Products = new Schema(
  {
    productName: { type: String, require: true },
    price: { type: Number, required: true },
    description: { type: String, require: true },
    discount: { type: Number, default: 0 },
    images: { type: [String] },
    accept: { type: String, default: false },
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
