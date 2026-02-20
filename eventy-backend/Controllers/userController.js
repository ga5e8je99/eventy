const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Event = require("../Models/events");

// ===== SMTP setup =====
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "eventyplaner@gmail.com",
    pass: "rgdu jijk wulv uxmd",
  },
});

// ===== Signup =====
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // ===== Validate required fields =====
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: "Name, email, password and confirmPassword are required.",
      });
    }

    // ===== Validate email format =====
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // ===== Validate password and confirmPassword match =====
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and confirmPassword do not match." });
    }

    // ===== Validate password strength =====
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters long and contain letters and numbers.",
      });
    }

    // ===== Validate if email already exists =====
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists. Please login or use another email.",
      });
    }

    // ===== Create User =====
    const user = new User({ name, email, phone, password });
    user.generateVerificationCode(); // Generate verification code

    await user.save();

    // ===== Send Verification Email =====
    await transporter.sendMail({
      from: "eventyplaner@gmail.com",
      to: email,
      subject: "Verify your account",
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; color: #0E377C;">
        <h2>Welcome to Event Planner!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Please use the verification code below to activate your account:</p>
        <div style="margin: 20px auto; padding: 15px 25px; width: fit-content; 
                    border: 2px dashed #A00651; color: #A00651; font-size: 24px; font-weight: bold;
                    border-radius: 8px;">
          ${user.verificationCode}
        </div>
        <p>If you didn't sign up, ignore this email.</p>
        <p style="color: #777; font-size: 12px;">Event Planner Team</p>
      </div>
      `,
    });

    res.json({ message: "Signup success. Verify account with code." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
};

// ===== Verify account =====
exports.verifyAccount = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({
      email,
      verificationCode: code.toString(),
    });

    if (!user) return res.status(400).json({ error: "Invalid code or email." });

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, name: user.name },
      "mysecretkey123",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Account verified successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("VerifyAccount error:", error);
    res.status(400).json({ error: error.message });
  }
};

// ===== Resend Verification Email =====
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ error: "Account already verified." });
    }

    // Generate new verification code
    user.generateVerificationCode();
    await user.save();

    // Send verification email
    await transporter.sendMail({
      from: "eventyplaner@gmail.com",
      to: user.email,
      subject: "Resend: Verify your account",
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; color: #0E377C;">
        <h2>Welcome to Event Planner!</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Please use the verification code below to activate your account:</p>
        <div style="margin: 20px auto; padding: 15px 25px; width: fit-content; 
                    border: 2px dashed #A00651; color: #A00651; font-size: 24px; font-weight: bold;
                    border-radius: 8px;">
          ${user.verificationCode}
        </div>
        <p>If you didn't sign up, ignore this email.</p>
        <p style="color: #777; font-size: 12px;">Event Planner Team</p>
      </div>
      `,
    });

    res.json({ message: "Verification email resent successfully." });
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// ===== Login =====
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password });

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ error: "Email and password required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log("User found:", {
      email: user.email,
      isVerified: user.isVerified,
    });

    // Verify if account is verified
    if (!user.isVerified) {
      console.log("Account not verified:", email);
      return res
        .status(400)
        .json({ error: "Account not verified. Please verify first." });
    }

    // Use the comparePassword method from the model
    const match = await user.comparePassword(password);
    console.log("Password match result:", match);

    if (!match) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id , name:user.name}, "mysecretkey123", {
      expiresIn: "7d",
    });

    console.log("Login successful for user:", email);
    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// ===== Change Password =====
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old password and new password are required." });
    }

    // Fetch user from the database
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    //verify old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(400).json({ error: "Old password is incorrect." });

    // Validate new password strength
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long." });
    }

    // Set new password (pre('save') will hash it automatically)
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// ===================================================================
//Reset Password Step 1: Forget Password
// ===================================================================
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    //======= Generate reset code =======
    const resetCode = user.generateResetPasswordCode();
    await user.save();

    // ===== Send Reset Code Email =====
    await transporter.sendMail({
      from: "eventyplaner@gmail.com",
      to: user.email,
      subject: "Password Reset Code",
      html: `
        <div style="font-family: Arial; padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello <b>${user.name}</b>,</p>
          <p>Your password reset code is:</p>
          <h2 style="color: #007bff;">${resetCode}</h2>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "Reset code sent to your email." });
  } catch (error) {
    console.error("Forget password error:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// ===================================================================
// Reset Password Step 2: Confirm Reset Code
// ===================================================================
exports.confirmResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code)
      return res.status(400).json({ error: "Email and code are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (
      user.resetPasswordCode !== code ||
      Date.now() > user.resetPasswordExpires
    ) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    // If code is valid
    res.json({
      message: "Code verified successfully. You can now reset password.",
    });
  } catch (error) {
    console.error("Confirm reset code error:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// ===================================================================
// Reset Password Step 3: Reset New Password
// ===================================================================
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, code, and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (
      user.resetPasswordCode !== code ||
      Date.now() > user.resetPasswordExpires
    ) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// ======================== Show Profile ========================
exports.viewProfile = async (req, res) => {
  try {
    // Basic user info (no sensitive fields)
    const user = await User.findById(req.user.id).select(
      "-password -verificationCode -resetPasswordCode -resetPasswordExpires"
    ).lean();

    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch events created by the user (organizer)
    const createdEventsPromise = Event.find({ organizer: user._id })
      .populate("attendees.user", "name email profileImage")
      .populate("allowedUsers", "name email profileImage")
      .lean();

    // Fetch events the user has attended (present in attendees array)
    const attendedEventsPromise = Event.find({ "attendees.user": user._id })
      .populate("organizer", "name email profileImage")
      .populate("attendees.user", "name email profileImage")
      .lean();

    // Fetch interested events from the user's list (if stored)
    const interestedEventsPromise = User.findById(user._id)
      .select("interestedEvents myEvents")
      .populate({ path: "interestedEvents", populate: { path: "organizer", select: "name email" } })
      .populate({ path: "myEvents", populate: { path: "organizer", select: "name email" } })
      .lean();

    const [createdEvents, attendedEvents, interestData] = await Promise.all([
      createdEventsPromise,
      attendedEventsPromise,
      interestedEventsPromise,
    ]);

    const interestedEvents = (interestData && interestData.interestedEvents) || [];
    const myEventsFromUser = (interestData && interestData.myEvents) || [];

    // Attach event lists to the profile response
    const profile = {
      ...user,
      createdEvents,
      attendedEvents: attendedEvents.map((ev) => {
        // find the attendee entry for this user to include attendance metadata
        const attendee = (ev.attendees || []).find(a => a.user && a.user._id && a.user._id.toString() === user._id.toString()) ||
                         (ev.attendees || []).find(a => a.user && a.user.toString && a.user.toString() === user._id.toString());

        return {
          ...ev,
          attendance: attendee
            ? {
                checkedIn: attendee.checkedIn,
                checkInTime: attendee.checkInTime,
                qrCode: attendee.qrCode,
              }
            : null,
        };
      }),
      interestedEvents,
      myEvents: myEventsFromUser,
    };

    res.json(profile);
  } catch (error) {
    console.error("View profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================== Update Profile ========================
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================== Show Interested Events ========================
exports.getInterestedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("interestedEvents");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.interestedEvents);
  } catch (error) {
    console.error("Get interested events error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================== Add Interested Event ========================
exports.addInterestedEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ error: "Event ID required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.interestedEvents.includes(eventId)) {
      user.interestedEvents.push(eventId);
      await user.save();
    }

    res.json({ message: "Event added to interested list" });
  } catch (error) {
    console.error("Add interested event error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================== Remove Interested Event ========================
exports.removeInterestedEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.interestedEvents = user.interestedEvents.filter(
      (id) => id.toString() !== eventId.toString()
    );
    await user.save();

    res.json({ message: "Event removed from interested list" });
  } catch (error) {
    console.error("Remove interested event error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================== Logout ========================
exports.logout = async (req, res) => {
  try {
    //Remove token from user document (if stored)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.token = null;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================== Delete Account ========================
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================== Check Token Expiration ========================
// This endpoint inspects the provided JWT token and returns whether it's valid
// and whether it's expired. The token can be passed in the Authorization header
// (Bearer <token>) or in the request body as `token`.
exports.checkToken = (req, res) => {
  try {
    // Accept token from header or body
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.body && req.body.token) {
      token = req.body.token;
    }

    if (!token) return res.status(400).json({ error: "Token not provided" });

    const JWT_SECRET = "mysecretkey123"; // keep consistent with auth middleware

    // First verify the token signature (ignore expiration for decoding exp)
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    } catch (err) {
      return res
        .status(401)
        .json({ valid: false, expired: false, error: "Invalid token" });
    }

    // Check expiration claim (exp is in seconds)
    const exp = decoded && decoded.exp ? decoded.exp * 1000 : null;
    const now = Date.now();

    if (!exp) {
      // No expiration claim - return valid but no expiry
      return res.json({
        valid: true,
        expired: false,
        expiresAt: null,
        decoded,
      });
    }

    const expired = now >= exp;
    return res.json({
      valid: !expired,
      expired,
      expiresAt: new Date(exp).toISOString(),
      decoded,
    });
  } catch (error) {
    console.error("checkToken error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
