"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Gamepad2, User, Users } from "lucide-react"

type Role = "AGENT" | "AFFILIATE"

export default function LoginPage() {
    const [role, setRole] = useState<Role>("AGENT")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 2000) // Mock login
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
                <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Sign in to your dashboard to manage your empire</p>
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
                    Agent
                </button>
                <button
                    onClick={() => setRole("AFFILIATE")}
                    className={`flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg transition-all ${role === "AFFILIATE"
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                        }`}
                >
                    <Users className="h-4 w-4" />
                    Affiliate
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground" htmlFor="email">Email</label>
                    <Input id="email" type="email" placeholder="name@example.com" required />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-muted-foreground" htmlFor="password">Password</label>
                        <Link href="#" className="text-xs text-primary hover:text-primary/80 hover:underline">Forgot password?</Link>
                    </div>
                    <Input id="password" type="password" placeholder="••••••••" required />
                </div>

                <Button variant="glow" className="w-full" size="lg" isLoading={isLoading}>
                    Sign In as {role === "AGENT" ? "Agent" : "Affiliate"}
                </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:text-primary/80 hover:underline">
                    Apply Now
                </Link>
            </div>
        </div>
    )
}
