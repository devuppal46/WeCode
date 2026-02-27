import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 flex items-center justify-between">
        {/* Left: Brand + Copyright stacked */}
        <div className="flex flex-col gap-1">
          <a href="#" className="flex items-center gap-2">
            <Image
              src="/coding.png"
              alt="WeCode Logo"
              width={28}
              height={28}
              className="w-7 h-7"
            />
            <span className="font-semibold text-white text-sm">WeCode</span>
          </a>
          <p className="text-xs text-zinc-500">made by dev & purvanshu</p>
        </div>

        {/* Right: Nav links inline */}
        <div className="flex flex-row items-center gap-6">
          <a href="https://github.com/devuppal46/WeCode" className="text-sm text-zinc-500 hover:text-white transition-colors">
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
