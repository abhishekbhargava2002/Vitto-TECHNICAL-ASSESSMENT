const mongoose = require("mongoose");
const Business = require("../models/business");

const validBusinessTypes = [
  "retail",
  "manufacturing",
  "services",
  "agriculture",
  "ecommerce",
  "other",
];

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const createBusiness = async (req, res) => {
  try {
    let { ownerName, panNumber, businessType, monthlyRevenue } = req.body;

    if (panNumber) panNumber = panNumber.toUpperCase();
    if (businessType) businessType = businessType.toLowerCase();

    if (!ownerName || !panNumber || !businessType || monthlyRevenue == null) {
      return res.status(400).json({
        success: false,
        error: "MISSING_FIELDS",
        message:
          "ownerName, panNumber, businessType, monthlyRevenue are required",
      });
    }

    if (!panRegex.test(panNumber)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_PAN",
        message: "PAN format invalid (Example: ABCDE1234F)",
      });
    }

    if (!validBusinessTypes.includes(businessType)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_BUSINESS_TYPE",
        message: `businessType must be one of: ${validBusinessTypes.join(", ")}`,
      });
    }

    if (typeof monthlyRevenue !== "number" || monthlyRevenue < 0) {
      return res.status(400).json({
        success: false,
        error: "INVALID_REVENUE",
        message: "monthlyRevenue must be a positive number",
      });
    }

    const existing = await Business.findOne({ panNumber });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: "DUPLICATE_PAN",
        message: "Business with this PAN already exists",
      });
    }

    const business = await Business.create({
      ownerName,
      panNumber,
      businessType,
      monthlyRevenue,
    });

    res.status(201).json({
      success: true,
      message: "Business profile created successfully",
      data: business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

const getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_ID",
        message: "Invalid business ID format",
      });
    }

    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: "Business not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    let { ownerName, panNumber, businessType, monthlyRevenue } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_ID",
        message: "Invalid business ID",
      });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    if (ownerName !== undefined) {
      if (typeof ownerName !== "string" || ownerName.trim().length < 3) {
        return res.status(400).json({
          success: false,
          error: "INVALID_OWNER_NAME",
          message: "Owner name must be at least 3 characters",
        });
      }
      business.ownerName = ownerName;
    }

    if (panNumber !== undefined) {
      panNumber = panNumber.toUpperCase();

      if (!panRegex.test(panNumber)) {
        return res.status(400).json({
          success: false,
          error: "INVALID_PAN",
          message: "PAN format invalid (ABCDE1234F)",
        });
      }
      business.panNumber = panNumber;
    }

    if (businessType !== undefined) {
      businessType = businessType.toLowerCase();

      if (!validBusinessTypes.includes(businessType)) {
        return res.status(400).json({
          success: false,
          error: "INVALID_BUSINESS_TYPE",
          message: `Allowed: ${validBusinessTypes.join(", ")}`,
        });
      }
      business.businessType = businessType;
    }

    if (monthlyRevenue !== undefined) {
      if (typeof monthlyRevenue !== "number" || monthlyRevenue < 0) {
        return res.status(400).json({
          success: false,
          error: "INVALID_REVENUE",
          message: "Revenue must be a positive number",
        });
      }

      business.monthlyRevenue = monthlyRevenue;
    }

    await business.save();

    return res.status(200).json({
      success: true,
      message: "Validation passed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_ID",
      });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        error: "NOT_FOUND",
      });
    }

    business.status = business.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await business.save();

    return res.status(200).json({
      success: true,
      message: `Business is now ${business.status}`,
      data: business,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

const deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_ID",
        message: "Invalid business ID",
      });
    }

    const business = await Business.findByIdAndDelete(id);

    if (!business) {
      return res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: "Business not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Business deleted successfully",
      data: business,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

module.exports = {
  createBusiness,
  getBusinessById,
  updateBusiness,
  toggleStatus,
  deleteBusiness,
};
