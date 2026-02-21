import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// --- Configuration ---
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// --- Types ---
interface User {
  socketId: string;
  userName: string;
}

interface Room {
  code: string;
  language: string;
  users: User[];
  canvasData?: any[];
}

interface ChatMessagePayload {
  userName: string;
  message: string;
  timestamp: string;
}

// --- State ---
// In-memory store for room state. For production, consider using Redis.
const rooms: Record<string, Room> = {};

// --- API Routes ---
// Map plain-text language names to Judge0 language IDs
const JUDGE0_LANGUAGE_MAP: Record<string, number> = {
  python: 71,       // Python 3.8.1
  python3: 71,
  javascript: 63,   // Node.js 12.14.0
  java: 62,         // Java 13.0.1
  cpp: 54,          // GCC 9.2.0
  "c++": 54,
  c: 50,            // GCC 9.2.0
  go: 60,           // Go 1.13.5
  rust: 73,         // Rust 1.40.0
};

app.post("/api/execute", async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code are required", output: "" });
  }

  const languageId = JUDGE0_LANGUAGE_MAP[language.toLowerCase()];

  if (!languageId) {
    return res.status(400).json({ error: "Unsupported language", output: "" });
  }

  try {
    // 1. Submit code to Judge0 endpoint
    // Using the free, public Judge0 CE API. 
    // In production, consider hosting your own Judge0 instance mapping or using RapidAPI.
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: languageId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY || "YOUR_RAPIDAPI_KEY_HERE", // Provide key here
        },
      }
    );

    const { stdout, stderr, compile_output, message } = response.data;

    if (compile_output) {
      return res.json({ error: compile_output, output: "" });
    }

    if (stderr || message) {
      return res.json({ error: stderr || message, output: stdout || "" });
    }

    return res.json({ error: null, output: stdout || "" });
  } catch (error: any) {
    console.error("Judge0 Execution Error:", error.response?.data || error.message);
    res.json({ error: "Execution service unavailable. Please try again later.", output: "" });
  }
});

// --- Socket Handlers ---
io.on("connection", (socket: Socket) => {
  console.log(`[+] User connected: ${socket.id}`);

  // 1. Join Room Event
  socket.on("joinRoom", ({ roomId, userName, language }: { roomId: string; userName: string; language: string }) => {
    socket.join(roomId);

    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        code: "// Start coding...",
        language: language || "python",
        users: [],
        canvasData: [],
      };
      console.log(`[+] Room created: ${roomId}`);
    }

    const room = rooms[roomId];

    // Add user to the room state
    room.users.push({
      socketId: socket.id,
      userName,
    });

    console.log(`[i] User '${userName}' joined room: ${roomId}`);

    // Sync initial state with the new user
    socket.emit("codeUpdate", room.code);
    socket.emit("languageUpdate", room.language);
    socket.emit("canvasUpdate", room.canvasData);

    // Broadcast updated user list to everyone in the room
    io.to(roomId).emit("userListUpdate", room.users);
  });

  // 2. Code Change Event
  socket.on("codeChange", ({ roomId, code }: { roomId: string; code: string }) => {
    if (!rooms[roomId]) return;

    // Update local state
    rooms[roomId].code = code;

    // Broadcast code change to all other users in the room
    socket.to(roomId).emit("codeUpdate", code);
  });

  // 3. Language Change Event
  socket.on("languageChange", ({ roomId, language }: { roomId: string; language: string }) => {
    if (!rooms[roomId]) return;

    // Update local state
    rooms[roomId].language = language;

    // Broadcast language change to all other users
    socket.to(roomId).emit("languageUpdate", language);
  });

  // 4. Chat Message Event
  socket.on("chatMessage", ({ roomId, userName, message }: { roomId: string; userName: string; message: string }) => {
    if (!roomId || !message?.trim()) return;

    const payload: ChatMessagePayload = {
      userName,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Broadcast the chat message to everyone in the room, including sender
    io.to(roomId).emit("chatMessage", payload);
  });

  // 5. Whiteboard Events
  socket.on("draw", ({ roomId, data }: { roomId: string; data: any }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].canvasData?.push(data);
    socket.to(roomId).emit("draw", data);
  });

  socket.on("clearCanvas", (roomId: string) => {
    if (!rooms[roomId]) return;

    rooms[roomId].canvasData = [];
    io.to(roomId).emit("clearCanvas");
  });

  // 6. Disconnect Event
  socket.on("disconnect", () => {
    console.log(`[-] User disconnected: ${socket.id}`);

    // Remove user from all active rooms
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const initialLength = room.users.length;

      room.users = room.users.filter((user) => user.socketId !== socket.id);

      if (room.users.length !== initialLength) {
        // Broadcast updated user list
        io.to(roomId).emit("userListUpdate", room.users);
      }

      // Cleanup empty rooms
      if (room.users.length === 0) {
        delete rooms[roomId];
        console.log(`[-] Room deleted: ${roomId}`);
      }
    }
  });
});

// --- Server Startup ---
server.listen(PORT, () => {
  console.log(`🚀 Server is running and listening on port ${PORT}`);
});