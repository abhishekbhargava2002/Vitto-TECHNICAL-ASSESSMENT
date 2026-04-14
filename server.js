const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/business-profile", require("./routes/business"));
app.use("/api/loan-applications", require("./routes/loan"));
app.use("/api/decision-applications", require("./routes/decision"));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
