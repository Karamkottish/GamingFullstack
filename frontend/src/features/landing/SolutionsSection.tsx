"use client"
import { motion } from "framer-motion"
import { Monitor, Smartphone, Database, Layers } from "lucide-react"

const solutions = [
    {
        id: "turnkey",
        title: "Turnkey Casino",
        icon: <Monitor className="h-6 w-6" />,
        description: "Ready-to-launch platform with 5000+ games pre-integrated. Go live in 48 hours.",
        color: "from-violet-500 to-purple-500",
        image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "sportsbook-final",
        title: "Sportsbook API",
        icon: <Smartphone className="h-6 w-6" />,
        description: "Live odds for 50+ sports including eSports. High-frequency updates and risk management.",
        color: "from-blue-500 to-cyan-500",
        image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "crypto",
        title: "Crypto Gateway",
        icon: <Database className="h-6 w-6" />,
        description: "Accept BTC, ETH, USDT and 50+ altcoins with automated settlements and cold storage.",
        color: "from-yellow-500 to-orange-500",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "agent",
        title: "Agent System",
        icon: <UsersIcon />,
        description: "Multi-level agent management network (MLM-ready) with credit distribution logic.",
        color: "from-pink-500 to-rose-500",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
    }
]

function UsersIcon() {
    return <Layers className="h-6 w-6" />
}

export function SolutionsSection() {
    return (
        <section id="solutions" className="py-24 relative overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                        Tailored <span className="text-primary">Solutions</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Whether you are a startup or an enterprise, we have the stack for you.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 h-[600px] w-full">
                    {solutions.map((solution, index) => (
                        <SolutionCard key={solution.id} solution={solution} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function SolutionCard({ solution, index }: { solution: any, index: number }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`
                group relative flex-1 min-h-[200px] lg:min-h-full rounded-3xl overflow-hidden cursor-pointer
                transition-all duration-500 ease-in-out hover:flex-[3]
                border border-white/10 dark:border-white/5 bg-black
            `}
        >
            {/* Background Image with Zoom Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                style={{ backgroundImage: `url(${solution.image})` }}
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500`} />
            <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-20 group-hover:opacity-10 transition-opacity duration-500 mix-blend-overlay`} />

            {/* Content Container */}
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full z-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${solution.color} text-white shadow-lg`}>
                        {solution.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left drop-shadow-md">
                        {solution.title}
                    </h3>
                </div>

                <div className="lg:max-h-0 lg:group-hover:max-h-[200px] overflow-hidden transition-all duration-500 ease-in-out">
                    <p className="text-white/80 text-lg leading-relaxed opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {solution.description}
                    </p>
                    <button className="mt-6 text-sm font-semibold text-white flex items-center gap-2 hover:gap-3 transition-all group-hover:text-primary-foreground">
                        Learn more <span className="text-lg">→</span>
                    </button>
                </div>

                {/* Mobile Fallback: always show text on mobile since hover expansion is tricky */}
                <div className="block lg:hidden mt-2">
                    <p className="text-white/70 text-sm">
                        {solution.description}
                    </p>
                </div>
            </div>

        </motion.div>
    )
}
