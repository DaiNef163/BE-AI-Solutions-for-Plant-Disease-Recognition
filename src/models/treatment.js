const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//name: Tên của bệnh.
// symptoms và causes: Miêu tả triệu chứng và nguyên nhân gây bệnh.
// treatment và prevention: Phương pháp chữa trị và cách phòng ngừa.
// severityLevel: Đánh giá mức độ nghiêm trọng của bệnh.

const Treatment = new Schema(
  {
name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    symptoms: {
      type: String,
      required: true,
      trim: true,
    },
    causes: {
      type: String,
      required: true,
      trim: true,
    },
    treatment: {
      type: String,
      required: true,
      trim: true,
    },
    prevention: {
      type: String,
      trim: true,
    },
    severityLevel: {
      type: String,
      enum: ["low", "moderate", "high", "critical"],
      default: "low",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Treatment", Treatment, "treatments");
