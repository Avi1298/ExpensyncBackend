require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const connectDB = require("./auth-api/config/db");
const authRoutes = require("./auth-api/routes/authRoutes");
const socketHandler = require("./websocket/socketHandler");

const app = express();
connectDB();
app.use(express.json());
app.use("/api/auth", authRoutes);

// Create HTTP + WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
socketHandler(wss);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
