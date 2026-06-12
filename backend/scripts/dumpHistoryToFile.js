const mongoose = require('mongoose');
const fs = require('fs');
const SearchHistory = require('../models/SearchHistory');

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/form', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    const recs = await SearchHistory.find().sort({ createdAt: -1 }).limit(50).lean();
    fs.writeFileSync(__dirname + '/../recent_history.json', JSON.stringify(recs, null, 2));
    console.log('Wrote recent_history.json');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

run();
