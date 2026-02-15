"use client"

import { useState } from "react"
import CodeEditor from "@/components/editor/CodeEditor"
import ChatPanel from "@/components/chat/ChatPanel"
import UserList from "@/components/presence/UserList"

export default function RoomPage() {
  const [code, setCode] = useState("// Start coding...")
  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <div className="flex-1">
        <CodeEditor
        code={code}
        language="javascript"
        onChange={setCode}
      />
      </div>

      <div className="w-80 border-l border-zinc-800">
        <UserList />
        <ChatPanel />
      </div>
    </div>
  )
}