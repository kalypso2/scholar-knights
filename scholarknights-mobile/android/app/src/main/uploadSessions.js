const mongoose = require('mongoose');
const Group = require('../models/group');
const Course = require('../models/course'); // if using course IDs
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const creatorId = "67fec9b2c37bcc3483bc4ecc";

const sampleTags = ["Group Study", "Exam Review", "Homework Help", "1-on-1 Help"];
const modalities = ["Online", "In-person"];
const descriptions = [
    "Come study for the exam!",
    "Let's review the material together.",
    "Focused help on the homework problems.",
    "Private tutoring session available."
];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seedGroups(count = 200) {
    const courses = await Course.find(); // assumes courses already exist
    if (!courses.length) {
        console.log("No courses found.");
        process.exit();
    }

    const groups = [];

    for (let i = 0; i < count; i++) {
        const course = randomItem(courses);

        const group = new Group({
            title: `Session ${i + 1}`,
            course: course._id,
            location: randomItem(["Library", "Engineering Building", "Zoom", "Discord"]),
            capacity: Math.floor(Math.random() * 10) + 3,
            time: `${Math.floor(Math.random() * 12 + 1)}:${Math.random() < 0.5 ? "00" : "30"}`,
            date: new Date(Date.now() + Math.floor(Math.random() * 20) * 86400000), // today + 0–20 days
            members: [],
            privacy: Math.random() < 0.3,
            creator: creatorId,
            tags: [randomItem(sampleTags)],
            modality: randomItem(modalities),
            description: randomItem(descriptions)
        });

        groups.push(group);
    }

    await Group.insertMany(groups);
    console.log(`✅ Inserted ${groups.length} groups with creator ${creatorId}`);
    mongoose.disconnect();
}

seedGroups(200);
