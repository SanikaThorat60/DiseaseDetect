const mongoose = require('mongoose');
const SearchHistory = require('../models/SearchHistory');

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/form', { useNewUrlParser: true, useUnifiedTopology: true });
    const rec = await SearchHistory.findOne().sort({ createdAt: -1 }).lean();
    if (!rec) {
      console.log('NO_RECORDS');
      process.exit(0);
    }
    const out = {
      _id: rec._id,
      userName: rec.userName,
      userEmail: rec.userEmail,
      createdAt: rec.createdAt,
      result_keys: Object.keys(rec.result || {}),
      result_preview: rec.result || null
    };
    console.log(JSON.stringify(out, null, 2));
  } catch (err) {
    console.error('ERR', err);
  } finally {
    process.exit(0);
  }
}

run();
