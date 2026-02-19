"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import CodeEditor from "@/components/editor/CodeEditor";
import UserList from "@/components/presence/UserList";
import ChatPanel from "@/components/chat/ChatPanel";
import { socket } from "@/lib/socket";
import { Users, MessageSquare, Copy, Check } from "lucide-react";

interface User {
  socketId: string;
  userName: string;
}

type SidebarTab = "users" | "chat";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  // State — userName is state (not just ref) so the header re-renders with it
  const [userName, setUserName] = useState("Guest");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Start coding...");
  const [users, setUsers] = useState<User[]>([]);
  const [agenda, setAgenda] = useState("");
  const [activeTab, setActiveTab] = useState<SidebarTab>("users");
  const [copiedRoomId, setCopiedRoomId] = useState(false);

  // Keep a ref in sync for use inside socket callbacks (avoids stale closure)
  const userNameRef = useRef(userName);
  useEffect(() => { userNameRef.current = userName; }, [userName]);

  // ── Single init effect: read sessionStorage → connect socket → join room ──
  useEffect(() => {
    if (!roomId) return;

    // 1. Read persisted form data
    const storedName = sessionStorage.getItem("wecode_userName") ?? "Guest";
    const storedLang = sessionStorage.getItem("wecode_language") ?? "javascript";
    const storedAgenda = sessionStorage.getItem("wecode_agenda") ?? "";

    setUserName(storedName);
    setLanguage(storedLang);
    setAgenda(storedAgenda);
    userNameRef.current = storedName;

    // 2. Connect & join with the freshly-read values
    socket.connect();

    socket.emit("joinRoom", {
      roomId,
      userName: storedName,
      language: storedLang,
    });

    // 3. Incoming events
    socket.on("codeUpdate", (newCode: string) => {
      setCode(newCode);
    });

    socket.on("userListUpdate", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    socket.on("languageUpdate", (newLang: string) => {
      setLanguage(newLang);
    });

    return () => {
      socket.off("codeUpdate");
      socket.off("userListUpdate");
      socket.off("languageUpdate");
      socket.disconnect();
    };
  }, [roomId]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
    socket.emit("codeChange", { roomId, code: value });
  }, [roomId]);

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    socket.emit("languageChange", { roomId, language: lang });
  }, [roomId]);

  const copyRoomId = useCallback(() => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopiedRoomId(true);
      setTimeout(() => setCopiedRoomId(false), 2000);
    });
  }, [roomId]);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 h-11 border-b border-zinc-800 bg-zinc-950 shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push("/")}
            className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold shrink-0"
          >
            WeCode
          </button>

          <span className="text-zinc-700 shrink-0">/</span>

          {/* Room ID chip + copy */}
          <button
            onClick={copyRoomId}
            className="group flex items-center gap-1.5 font-mono text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 px-2.5 py-1 rounded-md transition-colors shrink-0"
          >
            {roomId}
            {copiedRoomId ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>

          {agenda && (
            <>
              <span className="text-zinc-700 shrink-0">—</span>
              <span className="text-xs text-zinc-500 italic truncate max-w-[200px]">
                {agenda}
              </span>
            </>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-emerald-400 font-medium">
              {users.length} online
            </span>
          </div>
          {/* Current user name — now reactive because it's state */}
          <div className="text-[11px] text-zinc-500 hidden sm:block font-medium">
            {userName}
          </div>
        </div>
      </header>

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Editor */}
        <div className="flex-1 overflow-hidden min-w-0">
          <CodeEditor
            code={code}
            language={language}
            onChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
            userName={userName}
          />
        </div>

        {/* Sidebar */}
        <div className="w-64 shrink-0 border-l border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">

          {/* Tab switcher */}
          <div className="flex border-b border-zinc-800 shrink-0">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${activeTab === "users"
                  ? "text-white border-b-2 border-blue-500"
                  : "text-zinc-500 hover:text-zinc-300"
                }`}
            >
              <Users className="w-3.5 h-3.5" />
              Users
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${activeTab === "chat"
                  ? "text-white border-b-2 border-blue-500"
                  : "text-zinc-500 hover:text-zinc-300"
                }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "users" ? (
              <UserList users={users} currentUser={userName} />
            ) : (
              <ChatPanel roomId={roomId} userName={userName} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}