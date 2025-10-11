const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const FormModel = require("./models/form");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/form", {
  useNewUrlParser: true,// Use the modern connection string parser
  useUnifiedTopology: true   // Use the new server monitoring engine
});
mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const upload = multer({ storage: multer.memoryStorage() });

const PLANT_ID_API_KEY = process.env.PLANT_ID_API_KEY;
const PLANT_ID_URL = "https://api.plant.id/v2/health_assessment";

app.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageBase64 = req.file.buffer.toString("base64");

    const response = await axios.post(
      PLANT_ID_URL,
      {
        images: [imageBase64],
        modifiers: ["crops_simple", "similar_images"],
        plant_language: "en",
        disease_details: ["description", "treatment", "common_names"]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": PLANT_ID_API_KEY
        }
      }
    );

    console.log("Plant.id API response:", response.data);

    const diseases = response.data.health_assessment?.diseases || [];

    if (!diseases.length) {
      return res.json({
        disease: "Healthy",
        probability: 1,
        description: "No disease detected",
        treatment: { chemical: ["N/A"], biological: ["N/A"], prevention: ["N/A"] },
        similar_images: []
      });
    }

    const top = diseases[0];
    res.json({
      disease: top.name || "Unknown",
      probability: top.probability || 0,
      description: top.details?.description || "No description available",
      treatment: {
        chemical: top.details?.treatment?.chemical || ["N/A"],
        biological: top.details?.treatment?.biological || ["N/A"],
        prevention: top.details?.treatment?.prevention || ["N/A"]
      },
      similar_images: top.details?.similar_images?.map(img => img.url) || []
    });

  } catch (err) {
    console.error("Plant.id API error:", err.response?.data || err.message || err);
    res.status(500).json({
      disease: "Unknown",
      probability: 0,
      description: "Failed to detect disease. Please try again.",
      treatment: { chemical: ["N/A"], biological: ["N/A"], prevention: ["N/A"] },
      similar_images: []
    });
  }
});

// Login Endpoint
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await FormModel.findOne({ email });
    if (!user) return res.json("no record existed");
    if (user.password !== password) return res.json("password incorrect");
    res.json("success");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Signin / Signup Endpoint
app.post("/Signin", async (req, res) => {
  try {
    const form = await FormModel.create(req.body);
    res.json(form);
  } catch (err) {
    res.json(err);
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
