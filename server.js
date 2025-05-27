require("dotenv").config({ path: "/root/studyapp/.env" });
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://www.scholarknights.com',
    'http://scholarknights.com',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("? MongoDB Connected"))
  .catch((err) => console.error("? MongoDB Connection Error:", err));

// Email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "scholarknightsucf@gmail.com",
    pass: "caqj kmcc sjoj lyey",
  },
});

// ? API Routes ? MUST COME BEFORE STATIC FILE SERVING
const api = require("./api.js");
api.setApp(app, mongoose, jwt, transporter);

// CORS fallback
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// Basic Test
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ? Serve React frontend
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// ? Wildcard fallback ? must come LAST
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start Server
const PORT = 5001;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`?? Server running on port ${PORT}`)
);
