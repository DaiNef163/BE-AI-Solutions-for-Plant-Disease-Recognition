const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Crops = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accounts",
    },
    plantName: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      enum: ["healthy", "sick", "recovered"],
      default: "healthy",
    },
    plantDate: {
      type: String,
      default: Date.now(),
    },
    tokenUser: { type: String, required: true, ref: "Accounts" },

    illnessHistory: [
      {
        diseaseName: {
          type: String,
          require: true,
        },
        sickDay: {
          type: String,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Crops", Crops, "crops");
