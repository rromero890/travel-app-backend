const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const jwt = require("jsonwebtoken");

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}

// GET all trips
router.get("/", verifyToken, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: "Failed to get trips" });
  }
});

// POST new trip
router.post("/", verifyToken, async (req, res) => {
  try {
    const { destination, startDate, endDate, notes } = req.body;
    const newTrip = new Trip({
      userId: req.userId,
      destination,
      startDate,
      endDate,
      notes,
    });
    console.log("POST /api/trips body:", req.body);

    await newTrip.save();
    res.status(201).json({ message: "Trip saved!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save trip" });
  }
});

// PUT update trip
router.put("/:id", verifyToken, async (req, res) => {
  try {
    await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body
    );
    res.json({ message: "Trip updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update trip" });
  }
});

// DELETE a trip
router.delete("/:id", verifyToken, async (req, res) => {
    try {
      const result = await Trip.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId,
      });
  
      if (!result) {
        return res.status(404).json({ error: "Trip not found or not authorized" });
      }
  
      res.json({ message: "Trip deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete trip" });
    }
  });
  

module.exports = router;
