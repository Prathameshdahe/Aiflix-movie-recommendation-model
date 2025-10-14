import express from "express";
import { connectToDB } from "./config/db.js"; // Assuming db.js is in a 'config' folder
import dotenv from "dotenv";
import User from "./models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import axios from "axios"; // If not already imported

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(express.json());
app.use(cookieParser());

// --- CORS Configuration ---
const allowedOrigins = [
  "http://localhost:5173",          // Local development
  process.env.CLIENT_URL,           // Production frontend URL from environment variables
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or from the allowed list
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// --- Reusable Cookie Options ---
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

// --- Routes ---
app.get("/", (req, res) => {
  res.send("AIFlix API is active.");
});

// SIGNUP
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "User with this email already exists." });
    }
    if (await User.findOne({ username })) {
      return res.status(409).json({ message: "Username is already taken." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const userDoc = await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, { expiresIn: "15d" });

    res.cookie("token", token, { ...cookieOptions, maxAge: 15 * 24 * 60 * 60 * 1000 });
    
    // SECURITY FIX: Do not send password back to client
    userDoc.password = undefined; 
    res.status(201).json({ user: userDoc, message: "User created successfully." });

  } catch (error) {
    console.error("SIGNUP ERROR:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (!userDoc) return res.status(401).json({ message: "Invalid credentials." });

    const isPasswordValid = await bcryptjs.compare(password, userDoc.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, { expiresIn: "15d" });
    res.cookie("token", token, { ...cookieOptions, maxAge: 15 * 24 * 60 * 60 * 1000 });

    // SECURITY FIX: Do not send password back to client
    userDoc.password = undefined;
    res.status(200).json({ user: userDoc, message: "Logged in successfully." });

  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// FETCH USER
app.get("/api/fetch-user", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Unauthorized." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userDoc = await User.findById(decoded.id).select("-password");

    if (!userDoc) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ user: userDoc });

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Session may have expired." });
  }
});

// LOGOUT
app.post("/api/logout", (req, res) => {
  res.clearCookie("token", cookieOptions).json({ message: "Logged out successfully." });
});

// TMDb MOVIE SEARCH ROUTE
app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Query is required." });

  try {
    const tmdbRes = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: q,
        },
      }
    );
    res.json({ results: tmdbRes.data.results });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch from TMDb." });
  }
});

// AI RECOMMENDATION ROUTE
app.post("/api/ai-recommend", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required." });
  }
  console.log("Received prompt:", prompt);
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent", // <-- use this model name
      { contents: [{ parts: [{ text: prompt }] }] },
      { params: { key: process.env.GOOGLE_GENAI_API_KEY } }
    );
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({ result: text });
  } catch (err) {
    console.error("GenAI error:", err.response?.data || err.message, err.response?.status);
    res.status(500).json({
      error: "AI recommendation failed.",
      details: err.response?.data || err.message,
      stack: err.stack,
      status: err.response?.status,
    });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on port ${PORT}`);
});
