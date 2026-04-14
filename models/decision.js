const mongoose = require("mongoose");

const decisionSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
      unique: true,
    },

    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    decision: {
      type: String,
      enum: ["APPROVED", "REJECTED"],
      required: true,
    },

    creditScore: {
      type: Number,
      required: true,
    },

    reasonCodes: {
      type: [String],
      default: [],
    },

    breakdown: {
      emi: Number,
      revenueToEmiRatio: Number,
      loanToRevenueRatio: Number,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Decision", decisionSchema);
