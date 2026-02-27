import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinalCTA() {
  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight text-balance"
          style={{ fontFamily: "var(--font-cal-sans)" }}
        >
          Ready to master DSA together?
        </h2>
        <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Create a room, invite your friends, and start solving. No sign-up required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            asChild
            className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-8 h-14 text-base font-medium"
          >
            <Link href="/create">
              Create a Room
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-14 text-base font-medium border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 bg-transparent"
          >
            Join a Room
          </Button>
        </div>

        <p className="mt-8 text-sm text-zinc-500">Free and open source. Always.</p>
      </div>
    </section>
  )
}
