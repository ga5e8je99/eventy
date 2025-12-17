const express = require("express");
const router = express.Router();
const eventController = require("../Controllers/eventController");
const authenticate = require("../middlewares/auth");

// ===== Create Event =====
router.post("/", authenticate, eventController.createEvent);

// ===== Get All Events (Filter/Search) =====
router.get("/", eventController.getAllEvents);

// ===== Public Events Only =====
router.get("/public/all", eventController.getPublicEvents);

// ===== Private Events Only (for current user) =====
router.get("/private/all", authenticate, eventController.getPrivateEvents);

// ===== Approve or Reject by Admin =====
router.patch("/:id/approval", authenticate, eventController.approveEvent);

// ===== Get One Event by ID =====
router.get("/:id", eventController.getEventById);

// ===== Update Event =====
router.put("/:id", authenticate, eventController.updateEvent);

// ===== Delete Event =====
router.delete("/:id", authenticate, eventController.deleteEvent);

// ===== Join Event =====
router.post("/:id/join", authenticate, eventController.joinEvent);

// ===== Check-in with QR =====
router.patch("/:id/checkin", authenticate, eventController.checkIn);

// ===== Rate Event =====
router.post("/:id/rate", authenticate, eventController.rateEvent);

// ===== Get Provided Events (approved by admin) =====
router.get("/provided/events", eventController.getProvidedEvents);

// ===== Get Events Joined by Current User =====
router.get("/joined/events", authenticate, eventController.getUserJoinedEvents);

// ===== Payment Integration =====
router.post("/pay", authenticate, eventController.payForEvent);
// ===== Payment Callback =====
router.post("/pay/callback", eventController.paymobCallback);

module.exports = router;
