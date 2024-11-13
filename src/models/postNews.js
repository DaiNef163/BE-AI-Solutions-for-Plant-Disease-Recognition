const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accounts", 
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, 
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Accounts",
        },
        text: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    accept: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Posts", PostSchema, "PostNews");
