import { Plus, Share2, Code } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Plus,
    title: "Create a Room",
    description:
      "Start a new coding room in one click. Choose your language and get a unique room link instantly.",
  },
  {
    number: "02",
    icon: Share2,
    title: "Share the Link",
    description:
      "Send the room link to your teammates or friends. Anyone with the link can join and start coding.",
  },
  {
    number: "03",
    icon: Code,
    title: "Start Coding",
    description:
      "Write code together in real-time. See each other's cursors, run code, and build solutions faster.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-cal-sans)" }}
          >
            Get started in seconds
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            No sign-up walls. No complicated setup. Just create, share, and code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              {/* Connector line (between cards on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-zinc-700" />
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-zinc-800">
                  <step.icon className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-mono text-zinc-600">{step.number}</span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
