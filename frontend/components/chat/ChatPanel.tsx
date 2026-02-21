"use client"

import { useState, useEffect, useRef } from "react"
import { Send, MessageSquare } from "lucide-react"
import { socket } from "@/lib/socket"

interface ChatMessage {
  userName: string
  message: string
  timestamp: string
}

interface ChatPanelProps {
  roomId: string
  userName: string
  messages: ChatMessage[]
}

// Simple consistent color per username
function nameColor(name: string) {
  const colors = [
    "#60a5fa", // blue
    "#34d399", // emerald
    "#fbbf24", // amber
    "#f472b6", // pink
    "#a78bfa", // violet
    "#38bdf8", // sky
    "#fb923c", // orange
    "#4ade80", // green
  ]
  let hash = 0
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function ChatPanel({ roomId, userName, messages }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Auto-scroll on new message ──────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ── Send ────────────────────────────────────────────────────────────────
  const sendMessage = () => {
    const msg = input.trim()
    if (!msg || !roomId) return
    socket.emit("chatMessage", { roomId, userName, message: msg })
    setInput("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Chat
          </h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <MessageSquare className="w-6 h-6 text-zinc-700" />
            <p className="text-xs text-zinc-600">No messages yet.</p>
            <p className="text-[10px] text-zinc-700">Say hello 👋</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.userName === userName
          const color = nameColor(msg.userName)
          const showName =
            i === 0 || messages[i - 1].userName !== msg.userName

          return (
            <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {showName && (
                <span
                  className="text-[10px] font-semibold mb-1 px-1"
                  style={{ color }}
                >
                  {isMe ? "You" : msg.userName}
                </span>
              )}
              <div className="flex items-end gap-1.5">
                {!isMe && (
                  <div
                    className="w-1 rounded-full self-stretch shrink-0"
                    style={{ backgroundColor: color, minWidth: 3 }}
                  />
                )}
                <div
                  className={`relative max-w-[170px] px-3 py-2 rounded-2xl text-xs leading-relaxed break-words ${isMe
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-zinc-800 text-zinc-200 rounded-bl-sm"
                    }`}
                >
                  {msg.message}
                </div>
              </div>
              <span className="text-[9px] text-zinc-600 mt-0.5 px-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-zinc-800 shrink-0">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-zinc-600 transition-colors">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message…"
            className="flex-1 bg-transparent text-xs text-zinc-200 placeholder:text-zinc-600 outline-none min-w-0"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="shrink-0 text-zinc-500 hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[9px] text-zinc-700 mt-1.5 text-center">
          Enter to send
        </p>
      </div>
    </div>
  )
}