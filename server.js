require('dotenv').config({ path: '/root/studyapp/.env' });
const express = require('express');
const mongoose = require('mongoose');
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

// setting up email object for registering new users
const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
                user: 'scholarknightsucf@gmail.com',
                pass: '4331C0pp'
        }
});
//creating token for verfication link
const token = jwt.sign({
        data: 'Token Data'  .
    }, 'secretKey', { expiresIn: '10m' }  
);    


//  Register Route
app.post('/api/register', async (req, res) => {
  const { first_name, last_name, email, username, password, groups } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ first_name, last_name, email, username, password, groups });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
    //email verification sent
      const verificationMessage = {
      from:'scholarknightsucf@gmail.com',
      to: email
      subject:"Verify your Account"
      text: "Click the link to verify your email address http://www.scholarknights.com/verify/${token}"
    };
    transporter.sendMail(verificationMessage,function(error, info){
      if (error) throw Error(error);
      console.log('Email Sent Successfully');
      console.log(info);
    });
  
  } catch (error) {
    console.error(" Register API error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Verification Route
app.get('/verify/:token', (req, res)=>{
    const {token} = req.params;
    // Verifying the JWT token 
    jwt.verify(token, 'secretKey', function(err, decoded) {
        if (err) {
            console.log(err);
            res.send("Email verification failed");
        }
        else {
            res.send("Email verifified successfully");
        }
    });
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

app.post('/api/addgroup', async (req, res) => {
  var error = '';
  const {userId,course,time,location,capacity,title} = req.body;
  const newGroup = {Title:title,Course:course,Location:location,Capacity:capacity,Time:time,UserId:userId}
  
});

//  Basic Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//  Start Server
const PORT = 80;

app.listen(PORT, '0.0.0.0', () => console.log(` Server running on port ${PORT}`));

