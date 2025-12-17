const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  email: String,
  message: String,
  adminReply: String,
  repliedAt: Date
});

module.exports = mongoose.model("Contact", contactSchema);
