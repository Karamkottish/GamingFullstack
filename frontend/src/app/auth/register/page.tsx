"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Gamepad2, User, Users, ArrowRight } from "lucide-react"

type Role = "AGENT" | "AFFILIATE"

export default function RegisterPage() {
    const [role, setRole] = useState<Role>("AGENT")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <Link href="/" className="inline-flex items-center gap-2 justify-center mb-4 group">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Gamepad2 className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">NexusPlay</span>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-white">Join the Network</h1>
                <p className="text-sm text-muted-foreground">Start building your gaming empire today</p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                <button
                    onClick={() => setRole("AGENT")}
                    className={`flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg transition-all ${role === "AGENT"
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                        }`}
                >
                    <User className="h-4 w-4" />
                    Become Agent
                </button>
                <button
                    onClick={() => setRole("AFFILIATE")}
                    className={`flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg transition-all ${role === "AFFILIATE"
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                        }`}
                >
                    <Users className="h-4 w-4" />
                    Become Affiliate
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground" htmlFor="firstName">First name</label>
                        <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground" htmlFor="lastName">Last name</label>
                        <Input id="lastName" placeholder="Doe" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground" htmlFor="email">Work Email</label>
                    <Input id="email" type="email" placeholder="name@company.com" required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground" htmlFor="password">Password</label>
                    <Input id="password" type="password" placeholder="Create a strong password" required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground" htmlFor="telegram">Telegram ID</label>
                    <Input id="telegram" placeholder="@username" required />
                </div>

                <Button variant="glow" className="w-full group" size="lg" isLoading={isLoading}>
                    Create {role === "AGENT" ? "Agent" : "Affiliate"} Account
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 hover:underline">
                    Sign In
                </Link>
            </div>
        </div>
    )
}
