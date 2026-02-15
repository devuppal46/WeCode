"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
      <nav className="flex items-center justify-between px-6 lg:px-10 py-4 max-w-[1400px] mx-auto">
        {/* Logo - leftmost */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-zinc-950 font-bold text-sm">W</span>
          </div>
          <span className="font-semibold text-white text-lg">WeCode</span>
        </a>

        {/* Right side - Star on GitHub + Create Room */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/devuppal46/WeCode"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 rounded-full hover:border-zinc-600 transition-colors"
          >
            <Star className="w-4 h-4" />
            Star on GitHub
          </a>
          <Button size="sm" asChild className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-5 h-9 text-sm font-medium">
            <Link href="/create">Create Room</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-6 py-4">
          <div className="flex flex-col gap-3">
            <a
              href="https://github.com/devuppal46/WeCode"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Star className="w-4 h-4" />
              Star on GitHub
            </a>
            <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full">
              <Link href="/create">Create Room</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
