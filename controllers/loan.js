const Loan = require("../models/loan");
const Business = require("../models/business");
const mongoose = require("mongoose");

const createLoan = async (req, res) => {
  try {
    const { profileId, loanAmount, tenure, loanPurpose } = req.body;

    if (!profileId || !loanAmount || !tenure || !loanPurpose) {
      return res.status(400).json({
        success: false,
        error: "MISSING_FIELDS",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_PROFILE_ID",
      });
    }

    const business = await Business.findOne({
      _id: profileId,
      status: "ACTIVE",
    });
    if (!business) {
      return res.status(404).json({
        success: false,
        error: "PROFILE_NOT_FOUND",
      });
    }

    if (loanAmount <= 0) {
      return res.status(400).json({
        error: "INVALID_LOAN_AMOUNT",
      });
    }

    if (tenure < 1 || tenure > 120) {
      return res.status(400).json({
        error: "INVALID_TENURE",
      });
    }

    const loan = await Loan.create({
      profileId,
      loanAmount,
      tenure,
      loanPurpose,
    });

    res.status(201).json({
      success: true,
      message: "Loan application created",
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

const getLoanById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_ID",
      });
    }

    const loan = await Loan.findById(id).populate("profileId");

    if (!loan) {
      return res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: "Loan not found",
      });
    }

    res.status(200).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_ID",
      });
    }

    const loan = await Loan.findByIdAndDelete(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: "Loan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Loan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

module.exports = { createLoan, getLoanById, deleteLoan };
