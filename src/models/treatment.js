const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//name: Tên của bệnh.
// symptoms và causes: Miêu tả triệu chứng và nguyên nhân gây bệnh.
// treatment và prevention: Phương pháp chữa trị và cách phòng ngừa.
// severityLevel: Đánh giá mức độ nghiêm trọng của bệnh.

const Treatment = new Schema(
  {
    code: {
      type: Number,
      unique: true,
      required: true,
      trim: true,
    },
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

// Middleware to generate a unique code before saving
Treatment.pre("save", async function (next) {
  if (!this.code) {
    const randomString = () =>
      Math.random().toString(36).substring(2, 4).toUpperCase();
    const randomNumber = () => Math.floor(10 + Math.random() * 90).toString();

    this.code = randomString() + randomNumber();

    // Ensure uniqueness in case of collisions
    const existingTreatment = await mongoose.models.Treatment.findOne({
      code: this.code,
    });
    if (existingTreatment) {
      return next(new Error("Code collision occurred, please try again."));
    }
  }
  next();
});

module.exports = mongoose.model("Treatment", Treatment, "treatments");
