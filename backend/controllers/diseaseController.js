const axios = require("axios");
const SearchHistory = require('../models/SearchHistory');
exports.getHistoryForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const records = await SearchHistory.find({ user: userId }).sort({ createdAt: -1 }).lean();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history', error: err });
  }
};
exports.detectDisease = async (req, res) => {
  try {
    // existing detection logic...
    const responsePayload = {
      name: topDisease.name || "Unknown",
      probability: topDisease.probability || 0,
      description: topDisease.disease_details?.description || "No description available",
      treatment: { /* ... */ },
      similar_images: topDisease.similar_images?.map(img => img.url) || []
    };

    // Save history if client provided user or image data
    try {
      await SearchHistory.create({
        user: req.body.user?._id || undefined,
        userName: req.body.user?.name,
        userEmail: req.body.user?.email,
        imageUrl: req.body.imageUrl,     // optional
        result: responsePayload
      });
    } catch (saveErr) {
      console.error('Failed to save history:', saveErr);
    }

    return res.json(responsePayload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error processing disease data", error: err });
  }
};
exports.detectDisease = async (req, res) => {
 try {
  const topDisease = healthData.diseases.sort((a, b) => b.probability - a.probability)[0];

  res.json({
    name: topDisease.name || "Unknown",
    probability: topDisease.probability || 0,
    description: topDisease.disease_details?.description || "No description available",
        treatment: {
      chemical: topDisease.disease_details?.treatment?.chemical || [],
      biological: topDisease.disease_details?.treatment?.biological || [],
      prevention: topDisease.disease_details?.treatment?.prevention || [], // This line
    },
    similar_images: topDisease.similar_images?.map(img => img.url) || [],
  });
} catch (err) {
  console.error(err);
  res.status(500).json({ message: "Error processing disease data", error: err });
}

};
