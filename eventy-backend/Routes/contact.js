const express = require("express");
const {
  sendMessage,
  getAllMessages,
  replyToMessage,
  deleteMessage,
} = require("../Controllers/contactController.js");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/all", getAllMessages);
router.post("/reply/:id", replyToMessage);
router.delete("/delete/:id", deleteMessage);

module.exports = router;
