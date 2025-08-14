//Initialization
import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/your-db-name";

//Routes
app.get("/", (req, res) => {
  res.send("This is Home Page");
});

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
