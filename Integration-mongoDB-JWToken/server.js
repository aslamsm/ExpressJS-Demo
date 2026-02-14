// Load environment variables from a .env file (e.g. MONGO_URL, PORT)
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();

// Parse incoming JSON requests and limit payload size to mitigate large body attacks
app.use(express.json({ limit: "10kb" }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
  }),
);

// Basic rate limiter to prevent brute-force or excessive requests
// Here we limit to 3 requests per minute per IP (tweak for your needs)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // limit each IP to 3 requests per `windowMs`
});
app.use(limiter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const itemRoutes = require("./routes/items.routes");
app.use("/items", itemRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);
