const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt")
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
userSchema.pre('save', async function(next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
const check = async (candidate,pass)=>{
    try {
        const isMatch = await bcrypt.compare(candidate, pass);
        return isMatch;
    } catch (error) {
        console.error("Error comparing passwords:", error.message);
        throw new Error('Password comparison failed');
    }
};
const User = mongoose.model('User', userSchema);

module.exports = {User,check};
