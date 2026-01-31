"use client"
import { Button } from "@/components/ui/Button"
import { ArrowRight, ShieldCheck, Zap, Globe2 } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

            {/* Background Ambience */}
            <div className="absolute inset-0 w-full h-full bg-background">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-primary mb-8 hover:bg-white/10 transition-colors cursor-default backdrop-blur-md"
                >
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    Next-Gen Gaming Infrastructure
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 mb-6 max-w-4xl"
                >
                    Launch Your Casino & Sportsbook in <span className="text-primary">Minutes</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
                >
                    The most advanced white-label solution for iGaming.
                    Empower your agents, track affiliates, and scale globally with our
                    enterprise-grade platform.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Button variant="glow" size="lg" className="group">
                        Start Building Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" size="lg">
                        View Demo
                    </Button>
                </motion.div>

                {/* Floating Stats / Cards */}
                <div className="mt-20 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        icon={<Zap className="text-yellow-400" />}
                        title="Super Fast"
                        desc="<50ms Latency"
                        delay={0.4}
                    />
                    <StatsCard
                        icon={<ShieldCheck className="text-green-400" />}
                        title="Bank-Grade Security"
                        desc="ISO 27001 Certified"
                        delay={0.5}
                    />
                    <StatsCard
                        icon={<Globe2 className="text-blue-400" />}
                        title="Global Payments"
                        desc="Crypto & Fiat Ready"
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors flex items-center gap-4"
        >
            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                {icon}
            </div>
            <div className="text-left">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
        </motion.div>
    )
}
