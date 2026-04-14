const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    loanAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    tenure: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    loanPurpose: {
      type: String,
      enum: ["working_capital", "expansion", "equipment", "inventory", "other"],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING_DECISION", "APPROVED", "REJECTED"],
      default: "PENDING_DECISION",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Loan", loanSchema);
