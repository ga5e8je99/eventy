// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// 🔑 استخدم نفس secret في كل مكان (login, middleware, verify)
const JWT_SECRET = "mysecretkey123"; // ممكن تحطه في .env لاحقًا

// ===== Middleware للتحقق من JWT =====
const authMiddleware = (req, res, next) => {
  try {
    // التوكن غالبًا بيجي في الهيدر: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // استخراج التوكن فقط
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Invalid token format" });
    }

    // التحقق من صحة التوكن وفك التشفير
    const decoded = jwt.verify(token, JWT_SECRET);

    // حفظ بيانات المستخدم في req.user للاستخدام في الـ controllers
    req.user = { id: decoded.id ,name:decoded.name};
    next(); // السماح بالاستمرار
  } catch (error) {
    console.error("JWT authentication error:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = authMiddleware;
