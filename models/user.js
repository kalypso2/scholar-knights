const mongoose = require("mongoose");

//  Define User Schema
const UserSchema = new mongoose.Schema({
  first_name: {
  type:String,
  required: true
  },
  last_name: {
  type:String,
  required: true
  },
  email: {
  type:String,
  required: true
  },
  username: {
  type:String,
  required: true
  },
  password:  {  // No hashing for now
  type:String,
  required: true
  }, 
  courses: [String],
  groups: [mongoose.Schema.Types.Mixed],	
});
module.exports = user = mongoose.model("Users", UserSchema);
