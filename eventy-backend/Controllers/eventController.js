const mongoose = require("mongoose");
const Event = require("../Models/events");
const User = require("../Models/user");
const { v4: uuidv4 } = require("uuid");

// =====================================
// ========== CREATE EVENT =============
// =====================================
exports.createEvent = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: "Authentication required" });

    const {
      name,
      description,
      category,
      customCategory,
      location,
      type,
      isRecurring,
      coverImage,
      images,           // ⭐ تم إضافتها هنا
      ticketPrice,
      ticketTiers,
      capacity,
      startDate,
      endDate,
      startTime,
      endTime,
      isPublic,
      allowedUsers,
    } = req.body;

    // 🛑 التحقق من الحقول المطلوبة قبل إنشاء الحدث
    const requiredFields = [
      { field: name, msg: "name is required" },
      { field: description, msg: "description is required" },
      { field: category, msg: "category is required" },
      { field: type, msg: "type is required" },
      { field: capacity, msg: "capacity is required" },
      { field: coverImage, msg: "coverImage is required" },
      { field: startDate, msg: "startDate is required" },
      { field: endDate, msg: "endDate is required" },
      { field: startTime, msg: "startTime is required" },
      { field: endTime, msg: "endTime is required" },
      { field: location?.address, msg: "location.address is required" },
      { field: location?.latitude, msg: "location.latitude is required" },
      { field: location?.longitude, msg: "location.longitude is required" },
    ];

    for (let item of requiredFields) {
      if (!item.field)
        return res.status(400).json({ error: item.msg });
    }

    // organizer
    const organizer = await User.findById(req.user.id);
    if (!organizer)
      return res.status(404).json({ error: "Organizer not found" });

    // allowed private users
    const allowedUsersArray = Array.isArray(allowedUsers)
      ? allowedUsers.map(id => new mongoose.Types.ObjectId(id))
      : [];

    // ⭐ تجهيز الصور في Array
    const uploadedImages = Array.isArray(images) ? images : [];

    // ⭐ إنشاء الحدث
    const event = new Event({
      name,
      description,
      category,
      customCategory: category === "Other" ? customCategory : null,

      location: {
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
        road: location.road,
        country: location.country
      },

      type,
      isRecurring,
      coverImage,
      images: uploadedImages,  // ⭐ تم إضافة الصور هنا

      ticketPrice,
      ticketTiers,
      capacity,
      startDate,
      endDate,
      startTime,
      endTime,
      isPublic,
      allowedUsers: isPublic ? [] : allowedUsersArray,

      organizer: organizer._id,
    });

    await event.save();

    res.status(201).json({
      message: "Event created successfully",
      event,
    });

  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ error: "Failed to create event", details: error.message });
  }
};
 


// =====================================
// ======== APPROVE / REJECT EVENT =====
// =====================================
exports.approveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (action === "approve") {
      event.approvalStatus = "approved";
      event.rejectionReason = null;
    } else if (action === "reject") {
      event.approvalStatus = "rejected";
      event.rejectionReason = reason || "No reason provided";
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await event.save();
    res.status(200).json({ message: `Event ${action}d successfully`, event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// ========== GET ALL EVENTS ===========
// =====================================
exports.getAllEvents = async (req, res) => {
  try {
    const { status, category, city, search } = req.query;
    const filter = {};

    if (status) filter.approvalStatus = status;
    if (city) filter.city = city;
    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const events = await Event.find(filter);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// ========== GET PUBLIC EVENTS ========
// =====================================
exports.getPublicEvents = async (req, res) => {
  try {
    const events = await Event.find({
      approvalStatus: "approved",
      isPublic: true,
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// ========== GET PRIVATE EVENTS =======
// =====================================
exports.getPrivateEvents = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: "Authentication required" });

    const userId = req.user.id;
    const events = await Event.find({
      approvalStatus: "approved",
      isPublic: false,
      $or: [
        { organizer: userId },
        { allowedUsers: { $in: [userId] } },
      ],
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// ========== GET EVENT BY ID =========
// =====================================
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// ========== UPDATE EVENT =============
// =====================================
exports.updateEvent = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.category === "Other") {
      updates.customCategory = updates.customCategory || "Other Category";
    } else {
      updates.customCategory = null;
    }

    if (updates.allowedUsers) {
      updates.allowedUsers = Array.isArray(updates.allowedUsers)
        ? updates.allowedUsers.map(id => mongoose.Types.ObjectId(id))
        : [];
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!event) return res.status(404).json({ error: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// =====================================
// ========== DELETE EVENT =============
// =====================================
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// ========== JOIN EVENT ===============
// =====================================
exports.joinEvent = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: "Authentication required" });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.approvalStatus !== "approved")
      return res.status(400).json({ error: "Event not approved yet" });

    const userId = req.user.id;

    if (event.attendees?.some((a) => a.user.toString() === userId))
      return res.status(400).json({ error: "User already joined" });

    const qrCode = uuidv4();

    event.attendees.push({
      user: userId,
      qrCode,
      checkedIn: false,
    });

    await event.save();

    res.status(200).json({
      message: "Joined event successfully",
      qrCode,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// ========== CHECK-IN WITH QR =========
// =====================================
exports.checkIn = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const { qrCode } = req.body;

    const attendee = event.attendees.find((a) => a.qrCode === qrCode);

    if (!attendee)
      return res.status(404).json({ error: "Invalid QR Code" });

    attendee.checkedIn = true;
    attendee.checkInTime = new Date();

    await event.save();

    res.status(200).json({ message: "Checked in successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// ========== RATE EVENT ===============
// =====================================
exports.rateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const { rating, comment } = req.body;
    const userId = req.user.id;

    const attendee = event.attendees.find(
      (a) => a.user.toString() === userId && a.checkedIn
    );

    if (!attendee)
      return res.status(400).json({
        error: "Only checked-in attendees can rate the event",
      });

    event.reviews.push({
      user: userId,
      rating,
      comment,
    });

    const sum = event.reviews.reduce((acc, r) => acc + r.rating, 0);
    event.averageRating = sum / event.reviews.length;

    await event.save();

    res.status(200).json({
      message: "Rating added successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====================== Get Approved Events for Organizer ======================  
// =====================================
// ======== GET PROVIDED EVENTS ========
// (approved by admin)
// =====================================
exports.getProvidedEvents = async (req, res) => {
  try {
    // هنا بنجيب كل الأحداث اللي الأدمن وافق عليها
    const events = await Event.find({
      approvalStatus: "approved"
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============== Events user joined===============
exports.getUserJoinedEvents = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: "Authentication required" });
    const userId = req.user.id;

    const events = await Event.find({
      "attendees.user": userId,
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// =============== payment integration placeholder ===============

const axios = require("axios");

// ==============================
// ===== PAYMOB CONFIG =========
// ==============================
const PAYMOB_API_KEY =
  "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRFeE1qRXlNaXdpYm1GdFpTSTZJbWx1YVhScFlXd2lmUS5rMUpNUWVoOFFSOXhDM3FyU0pIdkJqTGVSQXNhY01SZW9JdG9TeEVKX1E0WURGM0pvZzBJVTFYV1BSc3MwSGN2M3V2M1dvV1RHZ3VMYUxBcHFfT2RTQQ=="; // ضع API key هنا
const PAYMOB_CARD_INTEGRATION_ID = 5420969 ;
const PAYMOB_WALLET_INTEGRATION_ID = 5421382;
const PAYMOB_IFRAME_ID = 984205;

// ==============================
// ===== GENERATE PAYMENT ======
// ==============================
exports.payForEvent = async (req, res) => {
  try {
    const { eventId, amount, paymentMethod } = req.body;

    // 1) AUTH
    const auth = await axios.post("https://accept.paymob.com/api/auth/tokens", {
      api_key: PAYMOB_API_KEY,
    });

    const token = auth.data.token;

    // 2) CREATE ORDER
    const order = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: token,
        delivery_needed: "false",
        amount_cents: amount * 100,
        currency: "EGP",
        items: [],
      }
    );

    const orderId = order.data.id;

    // 3) PAYMENT KEY
    const paymentKey = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: token,
        amount_cents: amount * 100,
        expiration: 3600,
        order_id: orderId,
        currency: "EGP",
        integration_id:
          paymentMethod === "card"
            ? PAYMOB_CARD_INTEGRATION_ID
            : PAYMOB_WALLET_INTEGRATION_ID,
        billing_data: {
          apartment: "NA",
          email: "test@user.com",
          floor: "NA",
          first_name: "Eventy",
          last_name: "User",
          street: "NA",
          building: "NA",
          phone_number: "+201000000000",
          city: "Cairo",
          country: "EG",
          state: "NA",
        },
      }
    );

    const pToken = paymentKey.data.token;

    // 4) IF CARD → RETURN IFRAME URL
    if (paymentMethod === "card") {
      return res.status(200).json({
        iframe_url: `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${pToken}`,
      });
    }

    // 5) IF WALLET → SEND PAYMENT REQUEST
    if (paymentMethod === "wallet") {
      const wallet = await axios.post(
        "https://accept.paymob.com/api/acceptance/payments/pay",
        {
          source: {
            identifier: req.body.walletNumber,
            subtype: "WALLET",
          },
          payment_token: pToken,
        }
      );

      return res.status(200).json(wallet.data);
    }
  } catch (error) {
    console.log(error.response?.data || error);
    res.status(500).json({ error: "Payment failed" });
  }
};

// =================================
// ====== CALLBACK FROM PAYMOB =====
// =================================
exports.paymobCallback = async (req, res) => {
  try {
    console.log("PAYMOB CALLBACK:", req.body);

    // هنا تقدر تعمل:
    // add ticket
    // update payment status
    // add attendee

    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("Callback error");
  }
};
