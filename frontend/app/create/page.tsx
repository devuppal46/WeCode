"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function generateRoomId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  const segments = [4, 4, 4]
  return segments
    .map((len) =>
      Array.from({ length: len }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join("")
    )
    .join("-")
}

export default function CreatePage() {
  const router = useRouter()
  const [roomId, setRoomId] = useState(generateRoomId())
  const [displayName, setDisplayName] = useState("")
  const [language, setLanguage] = useState("")
  const [agenda, setAgenda] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim() || !language) return
    // Persist session info so the room page can read it
    sessionStorage.setItem("wecode_userName", displayName.trim())
    sessionStorage.setItem("wecode_language", language)
    sessionStorage.setItem("wecode_agenda", agenda.trim())
    router.push(`/room/${roomId}`)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-white mb-1.5"
              style={{ fontFamily: "var(--font-cal-sans), sans-serif" }}
            >
              Initialize Workspace
            </h1>
            <p className="text-sm text-zinc-500">
              Secure, ephemeral environments.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Room ID */}
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Room ID
              </Label>
              <div className="flex gap-2">
                <Input
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="flex-1 bg-zinc-900 border-zinc-800 text-zinc-300 text-sm h-10 rounded-lg font-mono placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-zinc-700/40"
                  placeholder="xxxx-xxxx-xxxx"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setRoomId(generateRoomId())}
                  className="h-10 w-10 shrink-0 border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 rounded-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="sr-only">Generate new room ID</span>
                </Button>
              </div>
            </div>

            {/* Display Name */}
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Display Name
              </Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm h-10 rounded-lg placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-zinc-700/40"
                placeholder="Your name"
              />
            </div>

            {/* Language */}
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-zinc-300 text-sm h-10 rounded-lg data-[placeholder]:text-zinc-600 focus:border-zinc-600 focus:ring-zinc-700/40">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Agenda */}
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Agenda
              </Label>
              <Input
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm h-10 rounded-lg placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-zinc-700/40"
                placeholder="What are you building?"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!displayName.trim() || !language}
              className="w-full h-11 mt-2 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Session
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
