"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Star, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[1200px] bg-zinc-950/70 backdrop-blur-md border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden">
      <nav className="flex items-center justify-between px-6 lg:px-8 py-3 w-full">
        {/* Logo - leftmost */}
        <a href="#" className="flex items-center gap-2.5">
          <Image
            src="/coding.png"
            alt="WeCode Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-semibold text-white text-lg">WeCode</span>
        </a>

        {/* Right side - Star on GitHub + Join Room + Create Room */}
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
          <Button size="sm" variant="outline" asChild className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 bg-transparent rounded-full px-5 h-9 text-sm font-medium">
            <Link href="/join">
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              Join Room
            </Link>
          </Button>
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
            <Button variant="outline" asChild className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white bg-transparent rounded-full">
              <Link href="/join" onClick={() => setMobileMenuOpen(false)}>
                <LogIn className="w-4 h-4 mr-2" />
                Join Room
              </Link>
            </Button>
            <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full">
              <Link href="/create" onClick={() => setMobileMenuOpen(false)}>Create Room</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
