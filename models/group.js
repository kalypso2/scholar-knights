const mongoose = require("mongoose");
//  Define Group Schema
const GroupSchema = new mongoose.Schema({
    title: String,
    course: String,
    location: String,
    capacity: Number,
    time: String,
    date: Date,
    members: [mongoose.Schema.Types.Mixed], //array of users
    privacy: Boolean, //private is true public is false
});
module.exports = mongoose.model("Group", GroupSchema);