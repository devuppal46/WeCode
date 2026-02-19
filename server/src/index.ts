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

interface User {
  socketId: string;
  userName: string;
}

interface Room {
  code: string;
  language: string;
  users: User[];
}

const rooms: Record<string, Room> = {};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", ({ roomId, userName, language }) => {
    if (!roomId) return;

    socket.join(roomId);

    // Create room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        code: "// Start coding...",
        language: language || "javascript",
        users: [],
      };
    }

    const room = rooms[roomId];

    // ✅ Prevent duplicate user entries
    const alreadyExists = room.users.find(
      (user) => user.socketId === socket.id
    );

    if (!alreadyExists) {
      room.users.push({
        socketId: socket.id,
        userName,
      });
    }

    console.log("👥 Users in room:", room.users);

    // Send current state to joining user
    socket.emit("codeUpdate", room.code);
    socket.emit("languageUpdate", room.language);

    // Broadcast updated user list
    io.to(roomId).emit("userListUpdate", room.users);
  });

  socket.on("codeChange", ({ roomId, code }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.code = code;
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("languageChange", ({ roomId, language }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.language = language;
    socket.to(roomId).emit("languageUpdate", language);
  });

  socket.on("chatMessage", ({ roomId, userName, message }) => {
    if (!roomId || !message?.trim()) return;

    const payload = {
      userName,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    io.to(roomId).emit("chatMessage", payload);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    for (const roomId in rooms) {
      const room = rooms[roomId];

      const before = room.users.length;

      room.users = room.users.filter(
        (user) => user.socketId !== socket.id
      );

      if (room.users.length !== before) {
        io.to(roomId).emit("userListUpdate", room.users);
      }

      // Delete room if empty
      if (room.users.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});