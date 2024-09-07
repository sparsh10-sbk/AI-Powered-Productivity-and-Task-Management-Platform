const mongoose = require('mongoose');

// Define the Interest schema
const interestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true  // Associate interests with a specific user
  },
  interests: [String]  // Store interests as an array of strings
});

module.exports = mongoose.model('Interest', interestSchema);
