require("dotenv").config();
const express = require("express");
const connectDB = require("./auth-api/config/db");
const authRoutes = require("./auth-api/routes/authRoutes");

const app = express();
connectDB();
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
