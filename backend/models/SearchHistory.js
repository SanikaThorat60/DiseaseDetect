const mongoose = require('mongoose');
const { Schema } = mongoose;

const SearchHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'details', required: false },
  userName: { type: String },
  userEmail: { type: String },
  imageUrl: { type: String }, // store URL or data URI (base64)
  result: {
    name: String,
    probability: Number,
    description: String,
    treatment: Schema.Types.Mixed,
    similar_images: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);