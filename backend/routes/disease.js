// backend/routes/disease.js
const express = require("express");
const router = express.Router();
const { detectDisease } = require("../controllers/diseaseController");

router.post("/detect", detectDisease);

module.exports = router;
