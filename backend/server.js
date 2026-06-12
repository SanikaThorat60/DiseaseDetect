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
  useNewUrlParser: true,
  useUnifiedTopology: true
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
const SearchHistory = require('./models/SearchHistory');

app.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

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
      return res.json({ disease: "Healthy", probability: 1 });
    }

    const top = diseases[0] || {};
    const details = top.disease_details || {};

    // Helper to get text from potential arrays or objects
    const extractText = (field) => {
      if (!field) return "";
      if (Array.isArray(field)) return field.join(" ");
      if (typeof field === "object") return field.description || "";
      return String(field);
    };

    // Try a number of places for a readable disease/plant name
    const pickName = () => {
      return (
        top?.name ||
        top?.disease?.name ||
        details?.name ||
        details?.common_names?.[0] ||
        top?.plant?.name ||
        top?.plant?.common_names?.[0] ||
        top?.scientific_name ||
        response.data?.suggestions?.[0]?.plant_name ||
        response.data?.suggestions?.[0]?.name ||
        null
      );
    };

    let diseaseName = pickName() || 'Unknown';

    const treatmentParts = [];
    if (details.treatment?.biological) treatmentParts.push(`Biological: ${extractText(details.treatment.biological)}`);
    if (details.treatment?.chemical) treatmentParts.push(`Chemical: ${extractText(details.treatment.chemical)}`);
    if (details.treatment?.prevention) treatmentParts.push(`Prevention: ${extractText(details.treatment.prevention)}`);

    const responseBody = {
      disease: diseaseName,
      probability: top?.probability || 0,
      description: extractText(details.description) || "No description available.",
      treatment: treatmentParts.length > 0 ? treatmentParts.join("\n\n") : "No specific treatment steps found for this stage.",
      similar_images: top.similar_images?.map(i => i.url) || response.data.similar_images || [],
      raw: top
    };

    // If still Unknown, try a few raw fallbacks
    if ((!responseBody.disease || responseBody.disease === 'Unknown') && responseBody.raw) {
      const raw = responseBody.raw;
      responseBody.disease = raw?.suggestions?.[0]?.plant_name || raw?.suggestions?.[0]?.name || raw?.disease?.name || raw?.disease_details?.name || raw?.plant?.name || raw?.plant?.common_names?.[0] || responseBody.disease;
    }

    // Persist history if we have a meaningful name
    try {
      // ensure compatibility with SearchHistory schema which expects result.name
      responseBody.name = responseBody.disease;
      const user = req.body.user ? JSON.parse(req.body.user) : null;
      const shouldSave = responseBody.disease && responseBody.disease !== 'Unknown' && (responseBody.probability || 0) > 0.05;
      if (shouldSave) {
        const created = await SearchHistory.create({
          user: undefined,
          userName: user?.name,
          userEmail: user?.email,
          imageUrl: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : undefined,
          result: responseBody
        });
        console.log('Saved history id=', created._id.toString(), 'name=', responseBody.disease);
      } else {
        console.log('Skipping saving history for Unknown/low-confidence result');
      }
    } catch (saveErr) {
      console.error('Failed to save search history:', saveErr);
    }

    return res.json(responseBody);

  } catch (err) {
    console.error("Plant.id API error:", err.response?.data || err.message || err);
    return res.status(500).json({
      disease: "Unknown",
      probability: 0,
      description: "Failed to detect disease. Please try again.",
    });
  }
});

// History endpoint - fetch history by user email
app.get('/history/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const records = await SearchHistory.find({ userEmail: email }).sort({ createdAt: -1 }).lean();
    res.json(records);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ message: 'Error fetching history' });
  }
});

// Debug endpoint - fetch recent history (useful when email unknown)
app.get('/debug/history', async (req, res) => {
  try {
    const records = await SearchHistory.find().sort({ createdAt: -1 }).limit(50).lean();
    res.json(records);
  } catch (err) {
    console.error('Error fetching debug history:', err);
    res.status(500).json({ message: 'Error fetching debug history' });
  }
});

// Debug endpoint - fetch most recent saved record
app.get('/debug/last', async (req, res) => {
  try {
    const rec = await SearchHistory.findOne().sort({ createdAt: -1 }).lean();
    if (!rec) return res.status(404).json({ message: 'no records' });
    res.json(rec);
  } catch (err) {
    console.error('Error fetching debug last history:', err);
    res.status(500).json({ message: 'Error fetching debug last history' });
  }
});

// Delete history item by id
app.delete('/history/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await SearchHistory.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting history:', err);
    res.status(500).json({ message: 'Error deleting history' });
  }
});

// Login Endpoint
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await FormModel.findOne({ email });

    if (!user) {
      return res.json({ message: "no record existed" });
    }

    if (user.password !== password) {
      return res.json({ message: "password incorrect" });
    }

    return res.json({
      message: "success",
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "server error" });
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

// Log registered routes for debugging
const listRoutes = () => {
  try {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // routes registered directly on the app
        const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
        routes.push({ path: middleware.route.path, methods });
      } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
        // router middleware
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
            routes.push({ path: handler.route.path, methods });
          }
        });
      }
    });
    console.log('Registered routes:', routes);
  } catch (e) {
    console.error('Failed to list routes', e);
  }
};

app.listen(5000, () => {
  console.log("Server running on port 5000");
  listRoutes();
});
