"use client"
import { Button } from "@/components/ui/Button"
import { ArrowRight, ShieldCheck, Zap, Globe2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background/50">

            {/* Background Ambience - Optimized */}
            <div className="absolute inset-0 w-full h-full bg-background pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-primary/20 blur-[100px] animate-pulse transform-gpu" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-blue-600/10 blur-[100px] transform-gpu" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-40 dark:opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

                {/* Meteors / Floating Particles (CSS only for performance) */}
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-float opacity-50" />
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-primary/50 rounded-full animate-float delay-700" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">

                {/* LCP: First Paint Content */}
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-8 hover:bg-primary/20 transition-colors cursor-default backdrop-blur-md animate-fade-in-up opacity-0">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span className="font-semibold">Next-Gen Gaming Infrastructure</span>
                </div>

                <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl animate-fade-in-up-delay-1 opacity-0 leading-tight">
                    Launch Your Casino & <br className="hidden md:block" />
                    Sportsbook in <span className="animate-shimmer bg-[linear-gradient(110deg,#9333ea,45%,#c084fc,55%,#9333ea)] bg-[length:200%_100%] bg-clip-text text-transparent">Minutes</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-in-up-delay-2 opacity-0">
                    The most advanced white-label solution for iGaming.
                    Empower your agents, track affiliates, and scale globally with our
                    enterprise-grade platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up-delay-2 opacity-0">
                    <Button variant="glow" size="lg" className="group relative overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            Start Building Now
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-violet-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                    <Button variant="outline" size="lg" className="hover:bg-primary/5">
                        View Demo
                    </Button>
                </div>

                {/* Floating Stats / Cards */}
                <div className="mt-24 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        icon={<Zap className="text-yellow-400" />}
                        title="Super Fast"
                        desc="<50ms Latency"
                        delay={0.4}
                    />
                    <StatsCard
                        icon={<ShieldCheck className="text-green-500 dark:text-green-400" />}
                        title="Secure"
                        desc="ISO 27001 Ready"
                        delay={0.5}
                    />
                    <StatsCard
                        icon={<Globe2 className="text-blue-500 dark:text-blue-400" />}
                        title="Global"
                        desc="Crypto & Fiat"
                        delay={0.6}
                    />
                </div>
            </div>
        </section>
    )
}

function StatsCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all flex items-center gap-4 shadow-sm hover:shadow-xl hover:shadow-primary/5"
        >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/10 shrink-0">
                {icon}
            </div>
            <div className="text-left">
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
        </motion.div>
    )
}
