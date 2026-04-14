const express = require("express");
const router = express.Router();
const decisionRateLimiter = require("../middleware/rateLimit");
const { runDecision, getDecisionById } = require("../controllers/decision");

router.post("/", decisionRateLimiter, runDecision);
router.get("/:id", getDecisionById);

module.exports = router;
