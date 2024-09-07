const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 
const Task = require('./models/task'); 
const Interest = require('./models/interest');  // Import the Interest model

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('MONGO_DB_CONECTION_STRING', 
{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// ------------------- AUTH ROUTES ----------------------

// Register a new user
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();
    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'mysecretkey', { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ------------------- TASK CRUD OPERATIONS ----------------------

// 1. Fetch Tasks for a Specific User (GET)
app.get('/api/tasks/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ userId });  // Fetch tasks for this user
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
});

// 2. Create or Update Tasks for a Specific User (POST)
app.post('/api/tasks/:userId', async (req, res) => {
  const { userId } = req.params;
  const tasks = req.body;

  try {
    // Delete old tasks for the user before saving new ones
    await Task.deleteMany({ userId });

    // Add userId to each task before saving
    const tasksWithUserId = tasks.map(task => ({ ...task, userId }));
    await Task.insertMany(tasksWithUserId);  // Insert new tasks

    res.status(200).json({ message: 'Tasks saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save tasks', details: err.message });
  }
});

// 3. Delete a Task for a Specific User (DELETE)
app.delete('/api/tasks/:userId/:taskId', async (req, res) => {
  const { userId, taskId } = req.params;

  try {
    await Task.deleteOne({ _id: taskId, userId });  // Delete the task by task ID and user ID
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task', details: err.message });
  }
});

// ------------------- INTEREST CRUD OPERATIONS ----------------------

// 1. Fetch Interests for a Specific User (GET)
app.get('/api/interests/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userInterests = await Interest.findOne({ userId });
    res.status(200).json(userInterests ? userInterests.interests : []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interests', details: err.message });
  }
});

// 2. Create or Update Interests for a Specific User (POST)
app.post('/api/interests/:userId', async (req, res) => {
  const { userId } = req.params;
  const { interests } = req.body;  // Array of interests from the frontend

  try {
    let userInterests = await Interest.findOne({ userId });

    if (userInterests) {
      userInterests.interests = interests;
      await userInterests.save();
    } else {
      userInterests = new Interest({ userId, interests });
      await userInterests.save();
    }

    res.status(200).json({ message: 'Interests saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save interests', details: err.message });
  }
});

// 3. Delete an Interest for a Specific User (DELETE)
app.delete('/api/interests/:userId/:interest', async (req, res) => {
  const { userId, interest } = req.params;

  try {
    await Interest.updateOne({ userId }, { $pull: { interests: interest } });
    res.status(200).json({ message: 'Interest deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete interest', details: err.message });
  }
});

// ------------------- SERVER SETUP ----------------------

const PORT = 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
