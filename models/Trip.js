const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  destination: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  notes: { type: String },
});

module.exports = mongoose.model("Trip", TripSchema);
