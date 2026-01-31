"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const pricing = [
    {
        name: "Starter",
        price: { monthly: "999", yearly: "8,999" },
        desc: "Perfect for new agents.",
        features: ["White-label Casino", "Basic Admin Panel", "2000+ Games", "Crypto Payments Only", "Standard Support"],
        popular: false
    },
    {
        name: "Pro Scale",
        price: { monthly: "2,499", yearly: "24,999" },
        desc: "For growing operations.",
        features: ["Everything in Starter", "Sportsbook Integrated", "Agent System (3 Levels)", "Fiat + Crypto", "24/7 Dedicated Support", "Anti-Fraud AI"],
        popular: true
    },
    {
        name: "Enterprise",
        price: { monthly: "Custom", yearly: "Custom" },
        desc: "Full source code & control.",
        features: ["Full Source Code Access", "Custom Game Development", "Unlimited Agents", "On-Premise Deployment", "SLA 99.99%", "Legal Assistance"],
        popular: false
    }
]

export function PricingSection() {
    const [isYearly, setIsYearly] = useState(false)

    return (
        <section id="pricing" className="py-24 relative">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                        Simple, Transparent <span className="text-primary">Pricing</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        No hidden revenue share. Keep 100% of your profits.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <span className={cn("text-sm font-medium transition-colors", !isYearly ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-14 h-8 rounded-full bg-muted transition-colors focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <motion.div
                                className="absolute top-1 left-1 bg-primary w-6 h-6 rounded-full shadow-sm"
                                animate={{ x: isYearly ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={cn("text-sm font-medium transition-colors", isYearly ? "text-foreground" : "text-muted-foreground")}>
                            Yearly <span className="text-xs text-primary font-bold ml-1">-20%</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricing.map((plan, index) => (
                        <PricingCard key={index} plan={plan} isYearly={isYearly} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function PricingCard({ plan, isYearly, index }: { plan: any, isYearly: boolean, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "relative p-8 rounded-3xl border bg-card/50 backdrop-blur-sm flex flex-col",
                plan.popular ? "border-primary/50 shadow-[0_0_40px_rgba(124,58,237,0.15)] ring-1 ring-primary/20 scale-105 z-10" : "border-border hover:border-primary/30 transition-colors"
            )}
        >
            {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                    MOST POPULAR
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                        {typeof plan.price.monthly === 'string' && plan.price.monthly === "Custom"
                            ? "Custom"
                            : isYearly ? `$${plan.price.yearly}` : `$${plan.price.monthly}`
                        }
                    </span>
                    {plan.price.monthly !== "Custom" && (
                        <span className="text-muted-foreground">/{isYearly ? "yr" : "mo"}</span>
                    )}
                </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            <Button variant={plan.popular ? "glow" : "outline"} className="w-full">
                {plan.name === "Enterprise" ? "Contact Support" : "Get Started"}
            </Button>
        </motion.div>
    )
}
