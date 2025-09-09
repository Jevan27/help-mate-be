const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ Error connecting to MongoDB:", err));

// ✅ Example Schema for Help Requests
const requestSchema = new mongoose.Schema({
  title: String,
  description: String,
  neighborId: String,   // who asked for help
  helperId: String,     // who accepted (optional at first)
  status: { type: String, default: "open" }, // open, accepted, done
}, { timestamps: true });

const Request = mongoose.model("Request", requestSchema);

// ✅ Routes
app.get("/", (req, res) => {
  res.send("HelpMate API is running...");
});

// Create a request
app.post("/api/requests", async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    const saved = await newRequest.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all requests
app.get("/api/requests", async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
