"use client"
import { motion } from "framer-motion"
import { Users, BarChart3, Lock, Wallet, Globe, Smartphone } from "lucide-react"

const features = [
    {
        icon: <Users className="h-8 w-8 text-violet-400" />,
        title: "Advanced Agent System",
        description: "Multi-tier hierarchy management (Master -> Agent -> Player). Set credit limits, commission % and settle securely."
    },
    {
        icon: <BarChart3 className="h-8 w-8 text-pink-400" />,
        title: "Real-time Analytics",
        description: "Track GGR, NGR, and active player counts instantly. Visual dashboards for deep insights into your traffic."
    },
    {
        icon: <Lock className="h-8 w-8 text-green-400" />,
        title: "Fraud Protection",
        description: "AI-driven anti-fraud system detecting multi-accounting, bonus abuse, and suspicious betting patterns."
    },
    {
        icon: <Wallet className="h-8 w-8 text-yellow-400" />,
        title: "Unified Wallet",
        description: "Seamless wallet integration supporting both FIAT and Crypto (USDT, BTC, ETH) with auto-conversions."
    },
    {
        icon: <Globe className="h-8 w-8 text-blue-400" />,
        title: "Global CDN",
        description: "Lightning fast performance anywhere in the world. Optimized for low-bandwidth connections in emerging markets."
    },
    {
        icon: <Smartphone className="h-8 w-8 text-purple-400" />,
        title: "Mobile First",
        description: "Native-like experience on all devices. PWA support included for easy installation without app stores."
    }
]

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-black/20">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
                        Everything you need to run a <span className="text-primary">Powerhouse</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Our platform comes pre-loaded with enterprise tools designed for scaling from 10 to 10M players.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function FeatureCard({ feature, index }: { feature: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:from-white/[0.08] transition-all hover:-translate-y-1"
        >
            <div className="mb-6 inline-flex p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors ring-1 ring-white/10">
                {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
        </motion.div>
    )
}
