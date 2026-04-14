const express = require("express");
const router = express.Router();

const {
  createBusiness,
  getBusinessById,
  updateBusiness,
  toggleStatus,
  deleteBusiness,
} = require("../controllers/business");

router.post("/", createBusiness);
router.get("/:id", getBusinessById);
router.patch("/:id", updateBusiness);
router.patch("/status/:id", toggleStatus);
router.delete("/:id", deleteBusiness);

module.exports = router;
