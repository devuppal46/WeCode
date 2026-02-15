import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

function CodeEditorMock() {
  return (
    <div className="relative w-full max-w-[520px] ml-auto">
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
          </div>
          <span className="text-xs text-zinc-500 font-mono">main.py</span>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-emerald-400 font-medium">system online</span>
          </div>
        </div>
        {/* Code content */}
        <div className="p-4 font-mono text-xs leading-6">
          <div className="flex">
            <span className="text-zinc-600 w-6 text-right mr-3 select-none">1</span>
            <span>
              <span className="text-blue-400">def</span>{" "}
              <span className="text-emerald-400">solve</span>
              <span className="text-zinc-300">{"(nums, target):"}</span>
            </span>
          </div>
          <div className="flex">
            <span className="text-zinc-600 w-6 text-right mr-3 select-none">2</span>
            <span className="text-zinc-300 pl-8">
              {"seen = "}
              <span className="text-zinc-300">{"{}"}</span>
            </span>
          </div>
          <div className="flex">
            <span className="text-zinc-600 w-6 text-right mr-3 select-none">3</span>
            <span className="pl-8">
              <span className="text-blue-400">for</span>
              <span className="text-zinc-300">{" i, num "}</span>
              <span className="text-blue-400">in</span>
              <span className="text-zinc-300">{" enumerate(nums):"}</span>
            </span>
          </div>
          <div className="flex">
            <span className="text-zinc-600 w-6 text-right mr-3 select-none">4</span>
            <span className="pl-16">
              <span className="text-zinc-300">{"diff = target - num"}</span>
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-zinc-600 w-6 text-right mr-3 select-none">5</span>
            <span className="pl-16">
              <span className="text-blue-400">if</span>
              <span className="text-zinc-300">{" diff "}</span>
              <span className="text-blue-400">in</span>
              <span className="text-zinc-300">{" seen:"}</span>
            </span>
            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium bg-teal-500 text-white">Purvanshu</span>
          </div>
          <div className="flex">
            <span className="text-zinc-600 w-6 text-right mr-3 select-none">6</span>
            <span className="pl-24">
              <span className="text-blue-400">return</span>
              <span className="text-zinc-300">{" [seen[diff], i]"}</span>
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-zinc-600 w-6 text-right mr-3 select-none">7</span>
            <span className="pl-16">
              <span className="text-zinc-300">{"seen[num] = i"}</span>
            </span>
            <span className="ml-0.5 w-0.5 h-4 bg-amber-500 inline-block" />
            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-600 text-white">Dev Uppal</span>
          </div>
          <div className="flex">
            <span className="text-zinc-600 w-6 text-right mr-3 select-none">8</span>
            <span className="pl-8">
              <span className="text-blue-400">return</span>
              <span className="text-zinc-300">{" []"}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-6 lg:px-10 pt-20 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-zinc-800/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        {/* Left half - Text + Buttons */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-zinc-400">Collaborative Coding Platform</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 text-balance"
            style={{ fontFamily: "var(--font-cal-sans), sans-serif" }}
          >
            Code Together.
            <br />
            <span className="text-zinc-500">In Real Time.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-lg mb-10 leading-relaxed">
            Collaborate with friends instantly, write code simultaneously, and build faster. No setup required.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Button
              size="lg"
              asChild
              className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-7 h-12 text-sm font-medium"
            >
              <Link href="/create">
                Create Room
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-7 h-12 text-sm font-medium border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 bg-transparent"
            >
              Join Room
            </Button>
          </div>
        </div>

        {/* Right half - Code Editor */}
        <CodeEditorMock />
      </div>
    </section>
  )
}
