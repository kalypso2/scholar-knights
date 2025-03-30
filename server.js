require('dotenv').config({ path: '/root/studyapp/.env' });
const express = require('express');
const url = process.env.MONGODB_URI;
const mongoose = require('mongoose');
mongoose.connect(url)
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors());

//  Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.error(" MongoDB Connection Error:", err));

var api = require('./api.js');
api.setApp(app,mongoose;

// setting up email object for registering new users
const transporter = nodemailer.createTransport({ 
        service: 'gmail',
        auth:{
                user: 'scholarknightsucf@gmail.com',
                pass: 'caqj kmcc sjoj lyey'
        }
});

//  Basic Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//  Start Server
const PORT = 5000;

app.listen(PORT, '0.0.0.0', () => console.log(` Server running on port ${PORT}`));

