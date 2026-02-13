export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 flex items-center justify-between">
        {/* Left: Brand + Copyright stacked */}
        <div className="flex flex-col gap-1">
          <a href="#" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-xs">W</span>
            </div>
            <span className="font-semibold text-white text-sm">WeCode</span>
          </a>
          <p className="text-xs text-zinc-500">&copy; 2026 WeCode. Open Source.</p>
        </div>

        {/* Right: Nav links inline */}
        <div className="flex flex-row items-center gap-6">
          <a href="https://github.com" className="text-sm text-zinc-500 hover:text-white transition-colors">
            GitHub
          </a>
          <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
            About
          </a>
          <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
