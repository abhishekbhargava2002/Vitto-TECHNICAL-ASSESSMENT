const express = require("express");
const router = express.Router();
const { createLoan, getLoanById, deleteLoan } = require("../controllers/loan");

router.post("/", createLoan);
router.get("/:id", getLoanById);
router.delete("/:id", deleteLoan);

module.exports = router;
