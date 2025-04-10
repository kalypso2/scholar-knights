const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Course", CourseSchema);