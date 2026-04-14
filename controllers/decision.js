const Loan = require("../models/loan");
const Business = require("../models/business");
const Decision = require("../models/decision");
const mongoose = require("mongoose");

const runDecision = async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        error: "MISSING_APPLICATION_ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_APPLICATION_ID",
      });
    }

    const loan = await Loan.findById(applicationId);
    if (!loan) {
      return res.status(404).json({
        success: false,
        error: "LOAN_NOT_FOUND",
      });
    }

    const business = await Business.findById(loan.profileId);
    if (!business) {
      return res.status(404).json({
        success: false,
        error: "BUSINESS_NOT_FOUND",
      });
    }

    const existingDecision = await Decision.findOne({
      applicationId: loan._id,
    });

    if (existingDecision) {
      return res.status(400).json({
        success: false,
        error: "DECISION_ALREADY_EXISTS",
      });
    }

    const emi = loan.loanAmount / loan.tenure;
    const revenue = business.monthlyRevenue;
    console.log(emi, revenue);

    const revenueToEmiRatio = revenue / emi;
    const loanToRevenueRatio = loan.loanAmount / revenue;
    console.log(revenueToEmiRatio, loanToRevenueRatio);

    let creditScore = 700;
    let reasonCodes = [];

    // 1. Revenue check
    if (revenue < 100000) {
      creditScore -= 150;
      reasonCodes.push("LOW_REVENUE");
    }

    // 2. Loan to revenue
    if (loanToRevenueRatio > 24) {
      creditScore -= 200;
      reasonCodes.push("HIGH_LOAN_RATIO");
    }

    // 3. EMI affordability
    if (revenueToEmiRatio < 1.5) {
      creditScore -= 100;
      reasonCodes.push("INSUFFICIENT_EMI_COVERAGE");
    }

    // 4. Tenure risk ⭐ NEW
    let tenureRisk = "LOW";
    if (loan.tenure < 6 || loan.tenure > 60) {
      creditScore -= 50;
      reasonCodes.push("TENURE_RISK");
      tenureRisk = "HIGH";
    }

    // 5. Fraud check ⭐ IMPORTANT
    if (loanToRevenueRatio > 100) {
      creditScore = 0;
      reasonCodes.push("DATA_INCONSISTENCY");
    }

    // Final cap
    creditScore = Math.max(0, creditScore);

    const decisionResult = creditScore >= 600 ? "APPROVED" : "REJECTED";

    const decision = await Decision.create({
      applicationId: loan._id,
      profileId: business._id,
      decision: decisionResult,
      creditScore,
      reasonCodes,
      breakdown: {
        emi,
        revenueToEmiRatio,
        loanToRevenueRatio,
      },
    });

    loan.status = decisionResult;
    await loan.save();

    res.status(200).json({
      success: true,
      decision: decisionResult,
      creditScore,
      reasonCodes,
      breakdown: {
        emi,
        revenueToEmiRatio,
        loanToRevenueRatio,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

const getDecisionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_ID",
        message: "Invalid decision ID",
      });
    }

    const decision = await Decision.findById(id)
      .populate("applicationId")
      .populate("profileId");

    if (!decision) {
      return res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: "Decision not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: decision,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

module.exports = { runDecision, getDecisionById };
