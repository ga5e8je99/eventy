const express = require("express");
const mongoose = require("mongoose");
const eventRoutes = require("./Routes/event");
const userRoutes = require("./Routes/user");
const contactRoutes = require("./Routes/contact");
const cors = require("cors");

const app = express();
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(
    "mongodb+srv://ga138989_db_user:56aFFzaV2gn7ZWkq@cluster0.gkbq9vu.mongodb.net/?appName=Cluster0"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(console.error);

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://your-frontend-domain.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/eventy/events", eventRoutes);
app.use("/eventy/users", userRoutes);
app.use("/eventy/contact", contactRoutes);


app.listen(3000, () => console.log("🚀 Server running"));

module.exports = app; // لازم جداً
