const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const { schema } = require("./postNews");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    productName: { type: String, require: true },
    price: { type: Number, required: true },
    description: { type: String, require: true },
    discount: { type: Number, default: 0 },
    image: { type: Array },
    slug: {
      type: String,
      slug: "title",
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

module.exports = mongoose.model("Products", Product, "products");
