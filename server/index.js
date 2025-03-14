require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const executeRoute = require("./routes/executeRoute");
const debugAIRoutes = require("./routes/debugAI");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ✅ Check if Hugging Face API Key is available
if (!process.env.HF_API_KEY) {
  console.error("❌ Error: HF_API_KEY is missing. Check your .env file.");
  process.exit(1);
} else {
  console.log("✅ Hugging Face API Key Loaded:", process.env.HF_API_KEY.slice(0, 6) + "*****");
}

app.use(cors());
app.use(express.json());

// ✅ Define API Routes
app.use("/api", executeRoute);
app.use("/api/debug-ai", debugAIRoutes);

// ✅ Real-Time Collaboration
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) rooms.set(roomId, new Set());
    rooms.get(roomId).add(socket.id);
    console.log(`📌 User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    for (const [roomId, users] of rooms) {
      users.delete(socket.id);
      if (users.size === 0) rooms.delete(roomId);
    }
  });
});

// ✅ Start Server
server.listen(5000, () => console.log("🚀 Server running on port 5000"));
