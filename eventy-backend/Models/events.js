const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },

    // Date & Time
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    // Location
    location: {
      address: { type: String },
      latitude: { type: Number},
      longitude: { type: Number },
      city: { type: String },
      road: { type: String },
      country: { type: String }
    },

    // Images
    coverImage: { type: String, required: true },
    images: [{ type: String }],

    // Organizer (ONLY backend)
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Category
    category: { type: String, required: true },
    customCategory: { type: String },

    // Event Type
    type: { type: String, required: true },
    isRecurring: { type: String, default: "Not Annual" },

    // Tickets
    ticketPrice: { type: Number },
    ticketTiers: [
      {
        tierName: String,
        price: Number,
      }
    ],

    capacity: { type: Number, required: true },

    // Public / Private
    isPublic: { type: Boolean, default: true },
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // ⭐ Attendees (users who joined the event)
    attendees: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        qrCode: String,
        checkedIn: { type: Boolean, default: false },
        checkInTime: Date,
      }
    ],

    // Admin
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);

