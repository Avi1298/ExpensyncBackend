const WebSocket = require("ws");

const connectedUsers = new Map();

module.exports = (wss) => {
  wss.on("connection", (ws, req) => {
    console.log("New WebSocket connection");

    // Extract userId from query param
    const params = new URLSearchParams(req.url.replace("/", ""));
    const userId = params.get("userId");

    if (!userId) {
      console.log("❌ Connection closed: userId missing in query params");
      ws.close();
      return;
    }

    console.log(`✅ User ${userId} connected`);
    connectedUsers.set(userId, ws);

    ws.on("message", (message) => {
      console.log("Backend received raw message:", message);

      try {
        const data = JSON.parse(message);
        console.log("Parsed message:", data);

        if (data.type === "message") {
          const { fromUserId, toUserId, content } = data;
          console.log(`Message from ${fromUserId} to ${toUserId}: ${content}`);

          const receiverWS = connectedUsers.get(toUserId);

          if (receiverWS && receiverWS.readyState === WebSocket.OPEN) {
            console.log(`Sending message to user ${toUserId}`);
            const payload = JSON.stringify({
              message: content,
              sender: fromUserId,
              timestamp: new Date().toISOString(),
            });
            receiverWS.send(payload);
          } else {
            console.log(`❌ User ${toUserId} not connected or socket not open`);
          }
        } else {
          console.log("Received unsupported message type:", data.type);
        }
      } catch (err) {
        console.error("❌ Error parsing message:", err);
      }
    });

    ws.on("close", () => {
      console.log(`❌ User ${userId} disconnected`);
      connectedUsers.delete(userId);
    });

    ws.on("error", (err) => {
      console.error(`WebSocket error for user ${userId}:`, err);
    });
  });
};
