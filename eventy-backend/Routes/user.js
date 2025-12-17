const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const authenticate = require("../middlewares/auth");

router.post("/signup", userController.signup);
router.post("/verify", userController.verifyAccount);
router.post("/login", userController.login);
router.post("/check-token", userController.checkToken); // new endpoint to check token expiration
router.post("/change-password", authenticate, userController.changePassword);
router.post("/forget-password", userController.forgetPassword);
router.post("/confirm-reset-code", userController.confirmResetCode);
router.post("/reset-password", userController.resetPassword);
router.put("/update-profile", authenticate, userController.updateProfile);
router.get("/profile", authenticate, userController.viewProfile);
router.get("/:userId/interested", authenticate, userController.getInterestedEvents);
router.post("/:userId/interested", authenticate, userController.addInterestedEvent);// Add interested event
router.delete("/:userId/interested/:eventId", authenticate, userController.removeInterestedEvent);// Remove interested event
router.post("/logout", authenticate, userController.logout);
router.delete("/delete-account", authenticate, userController.deleteAccount);
router.post("/resend-verification", userController.resendVerificationEmail);


module.exports = router;
