const mongoose = require("mongoose");

// Define Group Schema
const GroupSchema = new mongoose.Schema({
    title: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // changed from String to ObjectId ref
    location: String,
    capacity: Number,
    time: String,
    date: Date,
    members: [mongoose.Schema.Types.Mixed],
    privacy: Boolean,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    modality: String,
    description: String,
    joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model("Group", GroupSchema);
