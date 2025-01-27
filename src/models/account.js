const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const genaration = require("../helper/genaration.js");

const Accounts = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "staff", "admin"],
    },
    avatar: {
      type: String,
      default: null,
    },
    tokenUser: {
      type: String,
      default: genaration.generateRandomString(20),
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Accounts", Accounts);
