"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CodeEditor from "@/components/editor/CodeEditor";
import UserList from "@/components/presence/UserList";
import { socket } from "@/lib/socket";

interface User {
  socketId: string;
  userName: string;
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const [code, setCode] = useState("// Start coding...");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!roomId) return;

    socket.connect();

    socket.emit("joinRoom", {
      roomId,
      userName: "User" + Math.floor(Math.random() * 1000),
    });

    socket.on("codeUpdate", (newCode: string) => {
      setCode(newCode);
    });

    socket.on("userListUpdate", (updatedUsers: User[]) => {
      console.log("👥 Updated users:", updatedUsers);
      setUsers(updatedUsers);
    });

    return () => {
      socket.off("codeUpdate");
      socket.off("userListUpdate");
      socket.disconnect();
    };
  }, [roomId]);

  const handleChange = (value: string) => {
    setCode(value);

    socket.emit("codeChange", {
      roomId,
      code: value,
    });
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <div className="flex-1">
        <CodeEditor
          code={code}
          language="javascript"
          onChange={handleChange}
        />
      </div>

      <div className="w-80 border-l border-zinc-800 p-4">
        <UserList users={users} />
      </div>
    </div>
  );
}