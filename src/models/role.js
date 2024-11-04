const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    permission: {
      type: [String], // danh sách quyền, ví dụ: ["products_create", "products_delete"]
      default: [],
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

module.exports = mongoose.model("Role", RoleSchema);
