const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
  //  identity information
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    profileImage: { type: String },

    // Organization Information
    organizationName: { type: String },
    logoUrl: { type: String },
    website: { type: String },

    // Activation Status
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },

    // Password Reset
    resetPasswordCode: { type: String },
    resetPasswordExpires: { type: Date },

    // Events Created by User
    myEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

    // Events Interested In
    interestedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

    // User Role
    role: { type: String, enum: ["user", "admin"], default: "user" , required: true},

    // Session
    token: { type: String },
  },
  { timestamps: true }
);

// store hashed password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Verify password during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate account verification code
userSchema.methods.generateVerificationCode = function () {
  this.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  return this.verificationCode;
};

// Generate password reset code
userSchema.methods.generateResetPasswordCode = function () {
  this.resetPasswordCode = crypto.randomBytes(3).toString("hex"); // 6 chars
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // valid for 10 minutes
  return this.resetPasswordCode;
};

// Manage My Events
userSchema.methods.addMyEvent = function (eventId) {
  if (!this.myEvents.includes(eventId)) this.myEvents.push(eventId);
  return this.save();
};

userSchema.methods.removeMyEvent = function (eventId) {
  this.myEvents = this.myEvents.filter((id) => id.toString() !== eventId.toString());
  return this.save();
};

userSchema.methods.addInterestedEvent = function (eventId) {
  if (!this.interestedEvents.includes(eventId)) this.interestedEvents.push(eventId);
  return this.save();
};

userSchema.methods.removeInterestedEvent = function (eventId) {
  this.interestedEvents = this.interestedEvents.filter((id) => id.toString() !== eventId.toString());
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
