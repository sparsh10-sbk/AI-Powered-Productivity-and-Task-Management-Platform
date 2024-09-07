const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true  // Store the userId to associate tasks with specific users
  },
  description: {
    type: String,
    required: true  // Task description
  },
  priority: {
    type: Number,
    required: true  // Priority of the task (0-5, etc.)
  },
  timeLeft: {
    type: Number,
    required: true  // Duration left in days for the task
  },
  completed: {
    type: Boolean,
    default: false  // Mark whether the task is completed or not
  }
});

// Export the Task model
module.exports = mongoose.model('Task', taskSchema);
