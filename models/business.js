const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    panNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 
    },

    businessType: {
      type: String,
      required: true,
      enum: [
        "retail",
        "manufacturing",
        "services",
        "agriculture",
        "ecommerce",
        "other",
      ],
    },

    monthlyRevenue: {
      type: Number,
      required: true,
      min: 0, 
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Business", businessSchema);
