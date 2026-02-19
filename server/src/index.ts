import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 🧠 Store room state
interface Room {
  code: string;
  users: { socketId: string; userName: string }[];
}

const rooms: Record<string, Room> = {};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", ({ roomId, userName }) => {
    console.log("📥 joinRoom:", roomId, userName);

    socket.join(roomId);

    // Create room if not exists
    if (!rooms[roomId]) {
      rooms[roomId] = {
        code: "// Start coding...",
        users: [],
      };
    }

    const room = rooms[roomId];

    // Add user
    room.users.push({
      socketId: socket.id,
      userName,
    });
    console.log("Current users in room:", room.users);

    // Send latest code to joining user
    socket.emit("codeUpdate", room.code);

    // Broadcast updated user list
    io.to(roomId).emit("userListUpdate", room.users);
  });

  socket.on("codeChange", ({ roomId, code }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].code = code;

    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    // Remove user from all rooms
    for (const roomId in rooms) {
      const room = rooms[roomId];

      const initialLength = room.users.length;

      room.users = room.users.filter(
        (user) => user.socketId !== socket.id
      );

      if (room.users.length !== initialLength) {
        // Broadcast updated list
        io.to(roomId).emit("userListUpdate", room.users);
      }

      // Optional: delete room if empty
      if (room.users.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});