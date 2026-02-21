"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function JoinPage() {
    const router = useRouter()
    const [roomId, setRoomId] = useState("")
    const [displayName, setDisplayName] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const trimmedRoomId = roomId.trim()
        const trimmedName = displayName.trim()

        if (!trimmedName || !trimmedRoomId) return

        // Persist session info — the room page reads this
        sessionStorage.setItem("wecode_userName", trimmedName)
        // Language / agenda will be synced from the server on join
        sessionStorage.removeItem("wecode_language")
        sessionStorage.removeItem("wecode_agenda")

        router.push(`/room/${trimmedRoomId}`)
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
                            Join Workspace
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Enter a room ID to join an existing session.
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
                            <Input
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm h-10 rounded-lg font-mono placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-zinc-700/40"
                                placeholder="xxxx-xxxx-xxxx"
                                autoFocus
                                autoComplete="off"
                                spellCheck={false}
                            />
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

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={!displayName.trim() || !roomId.trim()}
                            className="w-full h-11 mt-2 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Join Session
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
