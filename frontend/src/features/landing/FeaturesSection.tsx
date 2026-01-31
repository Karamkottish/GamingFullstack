"use client"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { Users, BarChart3, Lock, Wallet, Globe, Smartphone, MousePointer2 } from "lucide-react"

const features = [
    {
        icon: <Users className="h-8 w-8 text-violet-500 dark:text-violet-400" />,
        title: "Advanced Agent System",
        description: "Multi-tier hierarchy management (Master -> Agent -> Player). Set credit limits, commission % and settle securely."
    },
    {
        icon: <BarChart3 className="h-8 w-8 text-pink-500 dark:text-pink-400" />,
        title: "Real-time Analytics",
        description: "Track GGR, NGR, and active player counts instantly. Visual dashboards for deep insights into your traffic."
    },
    {
        icon: <Lock className="h-8 w-8 text-green-500 dark:text-green-400" />,
        title: "Fraud Protection",
        description: "AI-driven anti-fraud system detecting multi-accounting, bonus abuse, and suspicious betting patterns."
    },
    {
        icon: <Wallet className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
        title: "Unified Wallet",
        description: "Seamless wallet integration supporting both FIAT and Crypto (USDT, BTC, ETH) with auto-conversions."
    },
    {
        icon: <Globe className="h-8 w-8 text-blue-500 dark:text-blue-400" />,
        title: "Global CDN",
        description: "Lightning fast performance anywhere in the world. Optimized for low-bandwidth connections in emerging markets."
    },
    {
        icon: <Smartphone className="h-8 w-8 text-purple-500 dark:text-purple-400" />,
        title: "Mobile First",
        description: "Native-like experience on all devices. PWA support included for easy installation without app stores."
    }
]

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-6 animate-fade-in-up">
                        <MousePointer2 className="h-3 w-3" />
                        Interactive Features
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                        Everything you need to run a <span className="text-primary">Powerhouse</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Our platform comes pre-loaded with enterprise tools designed for scaling from 10 to 10M players.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <SpotlightCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function SpotlightCard({ feature, index }: { feature: any, index: number }) {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            className="group relative p-8 rounded-2xl border border-border bg-card/60 dark:bg-white/[0.03] backdrop-blur-sm overflow-hidden"
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                        650px circle at ${mouseX}px ${mouseY}px,
                        rgba(124, 58, 237, 0.15),
                        transparent 80%
                        )
                    `,
                }}
            />

            <div className="relative z-10">
                <div className="mb-6 inline-flex p-3 rounded-xl bg-primary/10 dark:bg-white/5 group-hover:bg-primary/20 dark:group-hover:bg-white/10 transition-colors ring-1 ring-primary/20 dark:ring-white/10">
                    {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground dark:text-white mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
        </motion.div>
    )
}
