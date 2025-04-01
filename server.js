require("dotenv").config({ path: "/root/studyapp/.env" });
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");

const UserSchema = require('./models/user');
const GroupSchema = require('./models/group');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://www.scholarknights.com', // Only allow this domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // If you need to send cookies or authentication headers
}));
app.use(cors());
app.options('*', cors());

//  Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

// setting up email object for registering new users
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "scholarknightsucf@gmail.com",
    pass: "caqj kmcc sjoj lyey",
  },
});

var api = require("./api.js");
api.setApp(app, mongoose, jwt, transporter);

app.use((req, res, next) => {
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

app.use((req, res, next) => {
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

//  Basic Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//  Start Server
const PORT = 5001;

app.listen(PORT, "0.0.0.0", () =>
  console.log(` Server running on port ${PORT}`)
);