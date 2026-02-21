import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

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
app.post("/api/execute", (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code are required", output: "" });
  }

  const runId = Math.random().toString(36).substring(7);
  let command = "";
  let fileName = "";

  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  if (language === "python" || language === "python3") {
    fileName = `${runId}.py`;
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, code);
    command = `python ${filePath}`;
  } else if (language === "cpp" || language === "c++") {
    fileName = `${runId}.cpp`;
    const filePath = path.join(tempDir, fileName);
    const outPath = path.join(tempDir, `${runId}.exe`);
    fs.writeFileSync(filePath, code);
    command = `g++ ${filePath} -o ${outPath} && ${outPath}`;
  } else if (language === "java") {
    fileName = `Main.java`;
    const folderPath = path.join(tempDir, runId);
    fs.mkdirSync(folderPath, { recursive: true });
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, code);
    command = `javac ${filePath} && java -cp ${folderPath} Main`;
  } else {
    return res.status(400).json({ error: "Unsupported language", output: "" });
  }

  const execTimeout = 10000;

  exec(command, { timeout: execTimeout }, (error, stdout, stderr) => {
    // Cleanup temporary files
    try {
      if (language === "java") {
        fs.rmSync(path.join(tempDir, runId), { recursive: true, force: true });
      } else {
        const filePath = path.join(tempDir, fileName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (language === "cpp" || language === "c++") {
          const outPath = path.join(tempDir, `${runId}.exe`);
          if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
        }
      }
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }

    if (error) {
      if (error.killed) {
        return res.json({ error: "Execution timed out", output: stdout || stderr });
      }
      return res.json({ error: stderr || error.message || "Execution failed", output: stdout });
    }

    res.json({ error: stderr || null, output: stdout });
  });
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