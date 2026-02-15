"use client"

import { useRef } from "react"
import { Radio, Code2, Play, Trophy } from "lucide-react"

function LanguageTags() {
  const languages = [
    { name: "Python", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
    { name: "Java", color: "bg-red-500/15 text-red-400 border-red-500/20" },
    { name: "C++", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    { name: "JavaScript", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {languages.map((lang) => (
        <span key={lang.name} className={`px-2.5 py-1 text-xs font-mono border rounded-full ${lang.color}`}>
          {lang.name}
        </span>
      ))}
    </div>
  )
}

function ConsolePreview() {
  return (
    <div className="h-20 rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs">
      <div className="text-zinc-400">$ python main.py</div>
      <div className="text-zinc-500">{">>> Running..."}</div>
      <div className="text-zinc-300">Output: [0, 1]</div>
      <div className="text-emerald-400">Execution time: 12ms</div>
    </div>
  )
}

export function BentoGrid() {
  const ref = useRef(null)

  return (
    <section id="features" className="py-24 px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-cal-sans)" }}
          >
            Everything you need to collaborate
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Built for developers. Powerful features that make real-time collaboration seamless.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Real-Time Collaboration */}
          <div className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="p-2 rounded-lg bg-zinc-800 w-fit mb-4">
              <Radio className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-Time Collaboration</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              See live edits, cursors, and changes instantly via WebSockets. Code together as if you were in the same room.
            </p>
            <div className="relative h-16 w-full rounded-lg bg-zinc-800/50 border border-zinc-700/50 overflow-hidden flex items-center px-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-xs text-zinc-400">Alex</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="text-xs text-zinc-400">You</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-zinc-400">Sam</span>
                </div>
              </div>
              <span className="ml-auto text-[10px] text-zinc-600">editing line 5...</span>
            </div>
          </div>

          {/* Multi-Language Support */}
          <div className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="p-2 rounded-lg bg-zinc-800 w-fit mb-4">
              <Code2 className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Multi-Language Support</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Code in Java, C++, Python, or JavaScript. Switch languages on the fly with full syntax highlighting.
            </p>
            <LanguageTags />
          </div>

          {/* Instant Code Execution */}
          <div className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="p-2 rounded-lg bg-zinc-800 w-fit mb-4">
              <Play className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Code Execution</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Run code and view outputs directly in the browser. No local setup needed.
            </p>
            <ConsolePreview />
          </div>

          {/* Built for Hackathons */}
          <div className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="p-2 rounded-lg bg-zinc-800 w-fit mb-4">
              <Trophy className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Built for Hackathons</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Perfect for practicing DSA and interviews. Collaborate on problems, share solutions, and learn together.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/80 border border-zinc-700/50">
                <span className="text-xs text-zinc-500">Problems Solved</span>
                <span className="text-sm font-semibold text-white font-mono">1,247</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/80 border border-zinc-700/50">
                <span className="text-xs text-zinc-500">Active Rooms</span>
                <span className="text-sm font-semibold text-emerald-400 font-mono">342</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
