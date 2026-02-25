"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import CodeEditor from "@/components/editor/CodeEditor";
import UserList from "@/components/presence/UserList";
import ChatPanel from "@/components/chat/ChatPanel";
import Whiteboard from "@/components/whiteboard/Whiteboard";
import { socket } from "@/lib/socket";
import { codeTemplates } from "@/lib/codeTemplates";
import { Users, MessageSquare, Copy, Check, LogOut, Code2, Presentation } from "lucide-react";

interface User {
  socketId: string;
  userName: string;
}

interface ChatMessage {
  userName: string;
  message: string;
  timestamp: string;
}

type SidebarTab = "users" | "chat";
type MainTab = "code" | "whiteboard";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  // State — userName is state (not just ref) so the header re-renders with it
  const [userName, setUserName] = useState("Guest");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(() => {
    // Try to get the language from sessionStorage synchronously
    if (typeof window !== "undefined") {
      const storedLang = sessionStorage.getItem("wecode_language") ?? "python";
      return codeTemplates[storedLang as keyof typeof codeTemplates] || "";
    }
    return codeTemplates["python"];
  });
  const [users, setUsers] = useState<User[]>([]);
  const [agenda, setAgenda] = useState("");
  const [activeTab, setActiveTab] = useState<SidebarTab>("users");
  const [mainTab, setMainTab] = useState<MainTab>("code");
  const [copiedRoomId, setCopiedRoomId] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [receivedCode, setReceivedCode] = useState<string | null>(null);
  const [hasReceivedLanguage, setHasReceivedLanguage] = useState(false);

  // Keep a ref in sync for use inside socket callbacks (avoids stale closure)
  const userNameRef = useRef(userName);
  useEffect(() => { userNameRef.current = userName; }, [userName]);

  // ── Single init effect: read sessionStorage → connect socket → join room ──
  useEffect(() => {
    if (!roomId) return;

    // 1. Read persisted form data
    const storedName = sessionStorage.getItem("wecode_userName") ?? "Guest";
    const storedLang = sessionStorage.getItem("wecode_language") ?? "python";
    const storedAgenda = sessionStorage.getItem("wecode_agenda") ?? "";

    setUserName(storedName);
    setLanguage(storedLang);
    setAgenda(storedAgenda);
    userNameRef.current = storedName;
    setCode(codeTemplates[storedLang as keyof typeof codeTemplates] || "");

    // ✅ Prevent double connect
    if (!socket.connected) {
      socket.connect();
    }

    // ✅ Emit join logic
    const handleConnect = () => {
      socket.emit("joinRoom", {
        roomId,
        userName: storedName,
        language: storedLang,
      });
      // Emit initial code template will be handled after receiving updates
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);

    socket.on("codeUpdate", (newCode: string) => {
      setReceivedCode(newCode);
      setCode(newCode);
    });

    socket.on("userListUpdate", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    socket.on("languageUpdate", (newLang: string) => {
      setLanguage(newLang);
      setHasReceivedLanguage(true);
      if (receivedCode === "") {
        setCode(codeTemplates[newLang as keyof typeof codeTemplates]);
        socket.emit("codeChange", { roomId, code: codeTemplates[newLang as keyof typeof codeTemplates] });
      }
    });

    socket.on("chatMessage", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("codeUpdate");
      socket.off("userListUpdate");
      socket.off("languageUpdate");
      socket.off("chatMessage");
      socket.off("codeResult");
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
    const template = codeTemplates[lang as keyof typeof codeTemplates];
    setCode(template);
    socket.emit("languageChange", { roomId, language: lang });
    socket.emit("codeChange", { roomId, code: template });
  }, [roomId]);

  const copyRoomId = useCallback(() => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopiedRoomId(true);
      setTimeout(() => setCopiedRoomId(false), 2000);
    });
  }, [roomId]);

  const handleDisconnect = useCallback(() => {
    const confirmed = window.confirm("Are you sure you want to leave the workspace?");
    if (confirmed) {
      router.push("/");
    }
  }, [router]);

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

        {/* Center: Mode Toggler */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => setMainTab("code")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${mainTab === "code"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Code
          </button>
          <button
            onClick={() => setMainTab("whiteboard")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${mainTab === "whiteboard"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            Brainstorm
          </button>
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

        {/* Main Content (Editor or Whiteboard) */}
        <div className="flex-1 overflow-hidden min-w-0">
          {mainTab === "code" ? (
            <CodeEditor
              code={code}
              language={language}
              onChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
              userName={userName}
              roomId={roomId}
            />
          ) : (
            <Whiteboard roomId={roomId} />
          )}
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
              <ChatPanel
                roomId={roomId}
                userName={userName}
                messages={messages}
              />
            )}
          </div>

          {/* Disconnect Button at the bottom */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-950/50">
            <button
              onClick={handleDisconnect}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 hover:border-red-600 transition-all text-[11px] font-bold uppercase tracking-wider"
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}