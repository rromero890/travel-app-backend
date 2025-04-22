const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      console.log("Registering:", email); // <-- log incoming email
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration error:", err.message);
        res.status(500).json({ error: err.message });
      }
      
  });
  

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
