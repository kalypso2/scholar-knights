require('dotenv').config({ path: '/root/studyapp/.env' });
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//  Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.error(" MongoDB Connection Error:", err));

//  Define User Schema
const UserSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  username: String,
  password: String, // No hashing for now
  groups: [mongoose.Schema.Types.Mixed],	
});

const User = mongoose.model('User', UserSchema);

//  Register Route
app.post('/api/register', async (req, res) => {
  const { first_name, last_name, email, username, password, groups } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ first_name, last_name, email, username, password, groups });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(" Register API error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: user._id, email: user.email });
  } catch (error) {
    console.error(" Login API error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Basic Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//  Start Server
const PORT = 80;

app.listen(PORT, '0.0.0.0', () => console.log(` Server running on port ${PORT}`));

