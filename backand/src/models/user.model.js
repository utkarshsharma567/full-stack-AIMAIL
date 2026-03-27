const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // used to hash passwords securely

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    required: true,
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false,
    select:false
  },
  otp: {
    type: String,
    select:false
  },
  otpExpiry: {
    type: Date,
    select:false
  }
}, { timestamps: true });

/**
 * 🔐 Pre-save hook
 * This runs BEFORE saving the user document
 * It hashes the password so plain text is never stored in DB
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * 🔍 Compare password method
 * Used during login to check if entered password matches hashed password
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);