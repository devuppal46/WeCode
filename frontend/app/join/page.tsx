"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function JoinPage() {
    const router = useRouter()
    const [roomId, setRoomId] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const trimmedRoomId = roomId.trim()
        const trimmedName = displayName.trim()

        if (!trimmedName) {
            setError("Please enter your display name.")
            return
        }
        if (!trimmedRoomId) {
            setError("Please enter a room ID to join.")
            return
        }

        // Persist session info — the room page reads this
        sessionStorage.setItem("wecode_userName", trimmedName)
        // Language / agenda will be synced from the server on join
        sessionStorage.removeItem("wecode_language")
        sessionStorage.removeItem("wecode_agenda")

        router.push(`/room/${trimmedRoomId}`)
    }

    const isValid = displayName.trim().length > 0 && roomId.trim().length > 0

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8">
                    {/* Header */}
                    <div className="mb-8">
                        {/* Back link */}
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-6 flex items-center gap-1.5"
                        >
                            ← Back to home
                        </button>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                                <LogIn className="w-4 h-4 text-blue-400" />
                            </div>
                            <h1
                                className="text-2xl font-bold text-white"
                                style={{ fontFamily: "var(--font-cal-sans), sans-serif" }}
                            >
                                Join Workspace
                            </h1>
                        </div>
                        <p className="text-sm text-zinc-500">
                            Enter a room ID to join an existing session.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Room ID */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                                Room ID
                            </Label>
                            <Input
                                value={roomId}
                                onChange={(e) => {
                                    setRoomId(e.target.value)
                                    setError("")
                                }}
                                className="flex-1 bg-zinc-900 border-zinc-800 text-zinc-300 text-sm h-10 rounded-lg font-mono placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-zinc-700/40"
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
                                onChange={(e) => {
                                    setDisplayName(e.target.value)
                                    setError("")
                                }}
                                className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm h-10 rounded-lg placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-zinc-700/40"
                                placeholder="Your name"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-xs text-red-400 -mt-1 px-0.5">{error}</p>
                        )}

                        {/* Divider hint */}
                        <div className="flex items-center gap-3 py-1">
                            <div className="flex-1 h-px bg-zinc-800" />
                            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
                                You&apos;ll sync the room&apos;s code &amp; language
                            </span>
                            <div className="flex-1 h-px bg-zinc-800" />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={!isValid}
                            className="w-full h-11 mt-1 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Join Session
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </form>

                    {/* Footer link */}
                    <p className="mt-6 text-center text-xs text-zinc-600">
                        Don&apos;t have a room?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/create")}
                            className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2"
                        >
                            Create one
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
