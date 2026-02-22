// Landing page with organized components
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { BentoGrid } from "@/components/landing/bento-grid"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"
import { SmoothScroll } from "@/components/landing/smooth-scroll"

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-zinc-950">
        <Navbar />
        <Hero />
        <BentoGrid />
        <HowItWorks />
        <FinalCTA />
        <Footer />
      </main>
    </SmoothScroll>
  )
}