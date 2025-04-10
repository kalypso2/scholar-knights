require('express');
require('mongodb');
const cors = require('cors');
const User = require("./models/user.js");
const Group = require("./models/group.js");
const Course = require("./models/course.js");
const authMiddleware = require('./middleware/authMiddleware');
const mongoose = require('mongoose');
const crypto = require('crypto');
exports.setApp = function (app, mongoose, jwt, transporter) {

    console.log("setApp loaded");

    app.use(cors({
        origin: [
            "http://www.scholarknights.com/",
            "https://www.scholarknights.com/",
            "http://scholarknights.com/",
            "https://scholarknights.com/",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true // if you're using cookies or auth headers
    }));


    //  Register Route
    app.post('/register', async (req, res) => {
        const { first_name, last_name, email, username, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        try {
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) return res.status(400).json({ message: "User already exists" });

            const newUser = new User({
                first_name: first_name,
                last_name: last_name,
                email: normalizedEmail,
                username: username,
                password: password
            });
            await newUser.save();

            res.status(201).json({ message: "User registered successfully" });
            //creating token for verfication link
            const token = jwt.sign({ email: normalizedEmail }, 'secretKey', { expiresIn: '10m' });
            //email content
            const verificationMessage = {
                from: 'scholarknightsucf@gmail.com',
                to: normalizedEmail,
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

    //Resend Verification API
    app.post("/resend-verification", async (req, res) => {
        const { email } = req.body;
        const normalizedEmail = email.toLowerCase();
        try {
            const user = await User.findOne({ email: normalizedEmail });
            if (!user) return res.status(404).json({ message: "User not found" });

            const token = jwt.sign({ email: normalizedEmail }, "secretKey", { expiresIn: "10m" });
            const verificationMessage = {
                from: "scholarknightsucf@gmail.com",
                to: normalizedEmail,
                subject: "Verify your Account",
                text: `Click the link to verify your email address: http://www.scholarknights.com/verify/${token}`,
            };
            transporter.sendMail(verificationMessage, (error, info) => {
                if (error) throw Error(error);
                console.log("Verification Email Re-Sent");
                console.log(info);
            });

            res.status(200).json({ message: "Verification email resent successfully" });
        } catch (error) {
            console.error("Resend verification error:", error);
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
        const normalizedEmail = email.toLowerCase();

        try {
            const user = await User.findOne({ email: normalizedEmail });

            if (!user || user.password !== password) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ userId: user._id, email: user.email, first_name: user.first_name }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ token, userId: user._id, email: user.email, first_name: user.first_name });
        } catch (error) {
            console.error(" Login API error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // Forgot Password Button
    app.post('/forgot-password', async (req, res) => {
        const { email } = req.body;
        const normalizedEmail = email.toLowerCase();

        try {
            const user = await User.findOne({ email: normalizedEmail });
            if (!user) return res.status(404).json({ message: "User not found" });

            const token = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();

            const resetLink = `http://www.scholarknights.com/reset-password/${token}`;

            const message = {
                from: 'scholarknightsucf@gmail.com',
                to: normalizedEmail,
                subject: "Password Reset Request",
                text: `Click here to reset your password: ${resetLink}`
            };
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.error(" Email sending failed:", err);
                    return res.status(500).json({ message: "Email send failed", error: err.message });
                } else {
                    console.log(" Email sent:", info.response);
                    return res.status(200).json({ message: "Reset email sent" });
                }
            });
            res.status(200).json({ message: "Reset email sent" });
        } catch (error) {
            console.error("Forgot Password Error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // Send email to reset password
    app.post('/reset-password/:token', async (req, res) => {
        const { token } = req.params;
        const { newPassword } = req.body;

        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) return res.status(400).json({ message: "Invalid or expired token" });

            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(200).json({ message: "Password has been reset" });
        } catch (error) {
            console.error("Reset Password Error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    app.post('/addgroup', async (req, res) => {
        var error = '';
        const { title, course, location, capacity, time, date, members, privacy, creator, tags } = req.body;

        try {
            const newGroup = new Group({ title: title, course: course, location: location, capacity: capacity, time: time, date: date, members: members, privacy: privacy, creator: creator, tags: tags });

            await newGroup.save();
            res.status(201).json({ message: "Group created!", group: newGroup });
        }
        catch (error) {
            console.error("addgroup error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // Gets all study groups
    app.get('/groups', async (req, res) => {
        try {
            const groups = await Group.find();
            res.status(200).json({ groups });
        } catch (error) {
            console.error("GET /groups error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // Get a specific group by GroupId
    app.get('/groups/:groupId', async (req, res) => {
        const { groupId } = req.params;

        try {
            const group = await Group.findById(groupId);

            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }

            res.status(200).json({ group });
        } catch (error) {
            console.error("GET /groups/:groupId error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });


    // Gets all available sessions based off of user's courses
    app.get('/groups/mycourses', authMiddleware, async (req, res) => {
        try {
            const user = await User.findById(req.user.userId).populate('courses');
            const courseCodes = user.courses.map(course => course.courseCode);

            const groups = await Group.find({ course: { $in: courseCodes } });
            res.status(200).json({ groups });
        } catch (error) {
            console.error("GET /groups/mycourses error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // Get all sessions for a specific courseCode
    app.get('/groups/course/:courseCode', async (req, res) => {
        try {
            const { courseCode } = req.params;

            const groups = await Group.find({ course: courseCode });
            res.status(200).json({ groups });
        } catch (error) {
            console.error("GET /groups/course/:courseCode error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });


    // Get all groups the current user is a member of
    app.get('/user/groups/:userId', async (req, res) => {
        const { userId } = req.params;
        try {
            const createdGroups = await Group.find({ creator: userId });
            const joinedGroups = await Group.find({ members: userId, creator: { $ne: userId } });
            res.status(200).json({ createdGroups, joinedGroups });
        } catch (error) {
            console.error("GET /user/groups error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // Search and filter through sessions
    app.get('/groups/search/filter', authMiddleware, async (req, res) => {
        try {
            const {
                query,
                privacy,
                mode,
                date,
                relevant
            } = req.query;

            const filter = {};

            if (query) {
                filter.$or = [
                    { title: { $regex: query, $options: 'i' } },
                    { tags: { $regex: query, $options: 'i' } }
                ];
            }

            if (privacy === 'public') filter.privacy = false;
            else if (privacy === 'private') filter.privacy = true;

            if (mode) {
                filter.tags = { $regex: mode, $options: 'i' };
            }

            if (date) {
                const start = new Date(date);
                const end = new Date(date);
                end.setDate(end.getDate() + 1);
                filter.date = { $gte: start, $lt: end };
            }

            if (relevant === 'true') {
                const user = await User.findById(req.user.userId).populate('courses');
                if (user) {
                    const courseCodes = user.courses.map(c => c.courseCode);
                    filter.course = { $in: courseCodes };
                }
            }

            const groups = await Group.find(filter);
            res.status(200).json({ groups });
        } catch (error) {
            console.error("GET /groups/search/filter error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });


    // Create a course
    app.post('/courses', async (req, res) => {
        const { courseCode, title } = req.body;
        try {
            const newCourse = new Course({ courseCode, title });
            await newCourse.save();
            res.status(201).json({ message: "Course created", course: newCourse });
        } catch (error) {
            console.error("POST /courses error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // Get all courses
    app.get('/courses', async (req, res) => {
        try {
            const courses = await Course.find();
            res.status(200).json({ courses });
        } catch (error) {
            console.error("GET /courses error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // Add a course to a user profile
    app.post('/user/:userId/courses', async (req, res) => {
        const { courseId } = req.body;
        const { userId } = req.params;

        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            const course = await Course.findById(courseId);
            if (!course) return res.status(404).json({ message: "Course not found" });

            const alreadyAdded = user.courses.some(c => c.toString() === courseId);

            if (!alreadyAdded) {
                user.courses.push(courseId);
                await user.save();
            }

            const updatedUser = await User.findById(userId).populate("courses");

            res.status(200).json({
                message: "Course added to user",
                courses: updatedUser.courses
            });
        } catch (error) {
            console.error(" Error adding course to user:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });


    // Delete a course for a user
    app.delete('/user/:userId/courses/:courseId', async (req, res) => {
        const { userId, courseId } = req.params;

        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.courses = user.courses.filter(id => id.toString() !== courseId);
            await user.save();

            const updatedUser = await User.findById(userId).populate("courses");

            res.status(200).json({
                message: "Course removed from user",
                courses: updatedUser.courses
            });
        } catch (error) {
            console.error(" Error removing course from user:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // Get all courses for a user
    app.get('/user/:userId/courses', async (req, res) => {
        const { userId } = req.params;

        try {
            const user = await User.findById(userId).populate("courses");
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json({ courses: user.courses });
        } catch (error) {
            console.error(" Error fetching user's courses:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    app.post('/test', (req, res) => {
        res.json({ message: "API is live and responding!" });
    });

}

