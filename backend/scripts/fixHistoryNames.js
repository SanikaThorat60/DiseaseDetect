const mongoose = require('mongoose');
const SearchHistory = require('../models/SearchHistory');

function inferNameFromDescription(desc) {
  if (!desc || typeof desc !== 'string') return null;
  // Try to match patterns like "Xylella fastidiosa is ..." or "Powdery mildew is..."
  const m = desc.match(/^([A-Z][A-Za-z\-]+(?:\s+[A-Z][A-Za-z\-]+)*)\s+(is|are)\b/i);
  if (m && m[1]) return m[1].trim();
  // fallback: take first two words capitalized or first word
  const words = desc.split(/\s+/).slice(0, 4);
  const capWords = words.filter(w => /^[A-Z]/.test(w));
  if (capWords.length >= 1) return capWords.slice(0,2).join(' ');
  return null;
}

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/form', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for migration');
  const cursor = SearchHistory.find({ $or: [ { 'result.name': { $exists: false } }, { 'result.name': '' }, { 'result.disease': { $exists: false } } ] }).cursor();
  let updated = 0;
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const desc = doc.result?.description || '';
    const inferred = inferNameFromDescription(desc);
    if (inferred) {
      doc.result.name = inferred;
      doc.result.disease = inferred;
      await doc.save();
      updated++;
      console.log('Updated', doc._id.toString(), '->', inferred);
    } else {
      console.log('No name inferred for', doc._id.toString());
    }
  }
  console.log('Migration complete. Updated', updated, 'records.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
