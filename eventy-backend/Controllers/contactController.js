const Contact = require("../Models/contact.js");

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, message } = req.body;

    const msg = await Contact.create({
      fullName,
      phoneNumber,
      email,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: msg,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reply
exports.replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const msg = await Contact.findByIdAndUpdate(
      id,
      { adminReply: reply, repliedAt: new Date() },
      { new: true }
    );

    if (!msg) return res.status(404).json({ message: "Message not found" });

    return res.status(200).json({
      success: true,
      message: "Reply sent",
      data: msg,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await Contact.findByIdAndDelete(id);

    if (!msg) return res.status(404).json({ message: "Message not found" });

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
