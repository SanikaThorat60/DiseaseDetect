const mongoose = require('mongoose');
const SearchHistory = require('../models/SearchHistory');

function inferName(desc) {
  if (!desc || typeof desc !== 'string') return null;
  // Try pattern: "Name is ..."
  const m = desc.match(/^([A-Za-z][A-Za-z\-]+(?:\s+[A-Za-z][A-Za-z\-]+)*)\s+(is|are)\b/i);
  if (m && m[1]) return m[1].trim();
  // Fallback: take first two words
  const words = desc.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0]} ${words[1]}`;
  if (words.length === 1) return words[0];
  return null;
}

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/form', { useNewUrlParser: true, useUnifiedTopology: true });
  const recs = await SearchHistory.find({ $or: [ { 'result.name': { $exists: false } }, { 'result.name': '' }, { 'result.disease': { $exists: false } }, { 'result.disease': '' } ] }).lean();
  console.log('Records to update:', recs.length);
  let updated = 0;
  for (const r of recs) {
    const desc = r.result?.description || '';
    const inferred = inferName(desc) || 'Unknown';
    await SearchHistory.updateOne({ _id: r._id }, { $set: { 'result.name': inferred, 'result.disease': inferred } });
    console.log('Updated', r._id.toString(), '->', inferred);
    updated++;
  }
  console.log('Done. Updated', updated, 'records.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
