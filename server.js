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
api.setApp(app,client);

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

app.use((req, res, next) =>
{
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader(
'Access-Control-Allow-Headers',
'Origin, X-Requested-With, Content-Type, Accept, Authorization'
);
res.setHeader(
'Access-Control-Allow-Methods',
'GET, POST, PATCH, DELETE, OPTIONS'
);
next();
});

app.listen(PORT,() =>
  {
    console.log('Server listening on port ' + PORT);
  });

