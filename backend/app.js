import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // Make sure to include the user routes

export default app;
