require('express');
require('mongodb');
const cors = require('cors');
const User = require("./models/user.js");
const Group = require("./models/group.js");
exports.setApp = function (app, mongoose, jwt, transporter) {

    console.log("setApp loaded");

    // CORS config
    app.use(cors({
        origin: 'http://www.scholarknights.com',  // Allow only this origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow only these methods
        allowedHeaders: ['Content-Type', 'Authorization'],  // Allow these headers
    }));

    app.options('*', cors());


    //  Register Route
    app.post('/register', async (req, res) => {
        const { first_name, last_name, email, username, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: "User already exists" });

            const newUser = new User({
                first_name: first_name,
                last_name: last_name,
                email: email,
                username: username,
                password: password
            });
            await newUser.save();

            res.status(201).json({ message: "User registered successfully" });
            //creating token for verfication link
            const token = jwt.sign({ data: 'Token Data' }, 'secretKey', { expiresIn: '10m' });
            //email content
            const verificationMessage = {
                from: 'scholarknightsucf@gmail.com',
                to: email,
                subject: "Verify your Account",
                text: `Click the link to verify your email address: http://www.scholarknights.com/verify/${token}`
            };
            //email verification sent
            transporter.sendMail(verificationMessage, function (error, info) {
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
    app.get('/verify/:token', (req, res) => {
        const { token } = req.params;
        // Verifying the JWT token
        jwt.verify(token, 'secretKey', function (err, decoded) {
            if (err) {
                console.log(err);
                res.send("Email verification failed");
            }
            else {
                res.send("Email verified successfully");
            }
        });
    });

    //  Login Route
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email: email });

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



    app.post('/addgroup', async (req, res) => {
        var error = '';
        const { title, course, location, capacity, time, date, members, privacy } = req.body;
        const newGroup = new Group({ Title: title, Course: course, Location: location, Capacity: capacity, Time: time, Date: date, Members: members, Privacy: privacy });
        try {
            newGroup.save();
        }
        catch (e) {
            error = e.toString();
        }
    });

    app.post('/test', (req, res) => {
        res.json({ message: "API is live and responding!" });
    });

}