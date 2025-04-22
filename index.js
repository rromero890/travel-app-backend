const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const tripRoutes = require("./routes/trips");
app.use("/api/trips", tripRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
