const mongoose = require('mongoose');
const SearchHistory = require('../models/SearchHistory');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/form', { useNewUrlParser: true, useUnifiedTopology: true });
  const recs = await SearchHistory.find().sort({ createdAt: -1 }).limit(50).lean();
  recs.forEach(r => {
    console.log(r._id, 'nameExists=', Object.prototype.hasOwnProperty.call(r.result || {}, 'name'), 'diseaseExists=', Object.prototype.hasOwnProperty.call(r.result || {}, 'disease'));
  });
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
