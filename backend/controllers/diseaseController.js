const axios = require("axios");

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
