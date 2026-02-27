"use client"

import { useEffect, useRef, useState } from "react"
import { socket } from "@/lib/socket"
import {
    Pencil,
    Eraser,
    Trash2,
    Download,
    MousePointer2
} from "lucide-react"

interface WhiteboardProps {
    roomId: string
}

interface Point {
    x: number
    y: number
}

interface DrawData {
    prevPoint: Point | null
    currentPoint: Point
    color: string
    width: number
}

export default function Whiteboard({ roomId }: WhiteboardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState("#3b82f6") // Default blue
    const [lineWidth, setLineWidth] = useState(3)
    const [tool, setTool] = useState<"pencil" | "eraser">("pencil")
    const [eraserSize, setEraserSize] = useState<number>(15) // Default eraser size
    const prevPoint = useRef<Point | null>(null)

    // ── Setup Canvas ──────────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size to match display size
        const resizeCanvas = () => {
            const parent = canvas.parentElement
            if (!parent) return

            // Save current content before resizing
            const tempContent = ctx.getImageData(0, 0, canvas.width, canvas.height)

            canvas.width = parent.clientWidth
            canvas.height = parent.clientHeight

            // Restore content
            ctx.putImageData(tempContent, 0, 0)
        }

        // Initialize dimensions with a slight delay to ensure layout has settled
        setTimeout(resizeCanvas, 10)
        window.addEventListener("resize", resizeCanvas)

        // ── Socket Events ───────────────────────────────────────────────────────
        const handleDraw = (data: DrawData) => {
            drawLine(data.prevPoint, data.currentPoint, data.color, data.width)
        }

        const handleClear = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }

        const handleUpdate = (data: DrawData[]) => {
            if (!data) return
            data.forEach(d => drawLine(d.prevPoint, d.currentPoint, d.color, d.width))
        }

        socket.on("draw", handleDraw)
        socket.on("clearCanvas", handleClear)
        socket.on("canvasUpdate", handleUpdate)

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            socket.off("draw", handleDraw)
            socket.off("clearCanvas", handleClear)
            socket.off("canvasUpdate", handleUpdate)
        }
    }, [roomId])

    // ── Drawing Logic ─────────────────────────────────────────────────────────
    const drawLine = (
        prev: Point | null,
        current: Point,
        drawColor: string,
        width: number
    ) => {
        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx) return

        const startPoint = prev ?? current
        ctx.beginPath()
        ctx.lineWidth = width
        ctx.strokeStyle = drawColor
        ctx.lineJoin = "round"
        ctx.lineCap = "round"
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(current.x, current.y)
        ctx.stroke()
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDrawing(true)
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        prevPoint.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing) return
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const currentPoint = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }

        // zinc-950 to match background
        const drawColor = tool === "eraser" ? "#09090b" : color
        const finalWidth = tool === "eraser" ? eraserSize : lineWidth

        const drawData: DrawData = {
            prevPoint: prevPoint.current,
            currentPoint,
            color: drawColor,
            width: finalWidth,
        }

        drawLine(drawData.prevPoint, drawData.currentPoint, drawData.color, drawData.width)
        socket.emit("draw", { roomId, data: drawData })
        prevPoint.current = currentPoint
    }

    const stopDrawing = () => {
        setIsDrawing(false)
        prevPoint.current = null
    }

    const clearCanvas = () => {
        if (confirm("Clear the whole whiteboard?")) {
            socket.emit("clearCanvas", roomId)
        }
    }

    const downloadCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const link = document.createElement("a")
        link.download = `wecode-brainstorm-${Date.now()}.png`
        link.href = canvas.toDataURL()
        link.click()
    }

    return (
        <div className="flex flex-col h-full bg-zinc-950 overflow-hidden select-none relative">
            {/* ── Toolbar ───────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 z-10 shrink-0">
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setTool("pencil")}
                        className={`p-2 rounded-lg transition-colors ${tool === "pencil" ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                            }`}
                        title="Pencil"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setTool("eraser")}
                        className={`p-2 rounded-lg transition-colors ${tool === "eraser" ? "bg-emerald-600 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                            }`}
                        title="Eraser"
                    >
                        <Eraser className="w-4 h-4" />
                    </button>
                    {/* Eraser Size Controls */}
                    {tool === "eraser" && (
                        <div className="flex items-center gap-2 ml-3">
                            {[15, 30, 60].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setEraserSize(size)}
                                    className={`relative w-8 h-8 rounded-md flex items-center justify-center transition-all
                                        ${eraserSize === size
                                            ? "bg-emerald-500/20 border border-emerald-400"
                                            : "bg-zinc-800 border border-zinc-700 hover:border-emerald-400"
                                        }`}
                                    title={`Eraser ${size}px`}
                                >
                                    <div
                                        className="rounded-full bg-white"
                                        style={{
                                            width: size / 5,
                                            height: size / 5,
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="w-px h-6 bg-zinc-800 mx-2" />

                    {/* Colors */}
                    <div className="flex items-center gap-2">
                        {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#ffffff"].map((c) => (
                            <button
                                key={c}
                                onClick={() => {
                                    setColor(c)
                                    setTool("pencil")
                                }}
                                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool === "pencil" ? "border-white" : "border-transparent"
                                    }`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={downloadCanvas}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Download
                    </button>
                    <button
                        onClick={clearCanvas}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-white hover:bg-red-600 transition-all border border-red-500/20"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear
                    </button>
                </div>
            </div>

            {/* ── Canvas Area ───────────────────────────────────────────────────── */}
            <div className="flex-1 w-full relative bg-[#09090b] overflow-hidden group">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="absolute inset-0 cursor-crosshair touch-none"
                />

                {/* Helper Hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-[10px] text-zinc-500 flex items-center gap-2 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                    <MousePointer2 className="w-3 h-3" />
                    Everyone in the room can see what you draw
                </div>
            </div>
        </div>
    )
}
