const mongoose = require("mongoose");

//  Define User Schema
const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {  // No hashing for now
        type: String,
        required: true
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    groups: [mongoose.Schema.Types.Mixed],

    resetPasswordToken: String,
    resetPasswordExpires: Date,
});
module.exports = mongoose.model("User", UserSchema);