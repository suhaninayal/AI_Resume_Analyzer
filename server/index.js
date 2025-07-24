// ✅ Fix dotenv loading in ESM
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from correct path
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import customizeRoutes from "./routes/customizeRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORRECT CORS OPTIONS
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("SmartResume Backend is working");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/resume", protect, resumeRoutes);
app.use("/api/customize-resume", protect, customizeRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
