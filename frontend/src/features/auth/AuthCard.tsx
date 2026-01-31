"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Gamepad2, User, Users, ArrowRight, Mail, Lock, UserCircle } from "lucide-react"

type AuthMode = "login" | "register"
type Role = "AGENT" | "AFFILIATE"

interface AuthCardProps {
    initialMode?: AuthMode
}

export function AuthCard({ initialMode = "login" }: AuthCardProps) {
    const [mode, setMode] = useState<AuthMode>(initialMode)
    const [role, setRole] = useState<Role>("AGENT")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Toggle mode triggers the flip
    const toggleMode = () => setMode(mode === "login" ? "register" : "login")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Mock Login Delay then Redirect
        setTimeout(() => {
            setIsLoading(false)
            if (role === "AGENT") {
                router.push("/dashboard/agent")
            } else {
                router.push("/dashboard/affiliate")
            }
        }, 1500)
    }

    return (
        <div className="w-full max-w-md relative min-h-[650px] flex flex-col justify-center" style={{ perspective: "1000px" }}>
            {/* Ambient Glow Behind Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />

            <motion.div
                className="w-full relative preserve-3d transition-all duration-700 ease-in-out"
                animate={{ rotateY: mode === "register" ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* FRONT FACE: LOGIN */}
                <CardFace mode="login" isFlipped={mode === "register"}>
                    <div className="space-y-8">
                        <Header title="Welcome back" subtitle="Sign in to manage your empire" />

                        <RoleSwitcher role={role} setRole={setRole} />

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input className="pl-10 bg-black/20 border-white/10 focus:border-primary/50 transition-all" type="email" placeholder="name@company.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Password</label>
                                    <button type="button" className="text-xs text-primary hover:text-primary/80 hover:underline">Forgot password?</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input className="pl-10 bg-black/20 border-white/10 focus:border-primary/50 transition-all" type="password" placeholder="••••••••" />
                                </div>
                            </div>

                            <Button variant="glow" className="w-full py-6 text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" size="lg" isLoading={isLoading}>
                                Sign In as {role === "AGENT" ? "Agent" : "Affiliate"}
                            </Button>
                        </form>

                        <Footer text="Don't have an account?" action="Apply Now" onClick={toggleMode} />
                    </div>
                </CardFace>

                {/* BACK FACE: REGISTER */}
                <CardFace mode="register" isFlipped={mode === "register"}>
                    <div className="space-y-6">
                        <Header title="Join the Network" subtitle="Start building your gaming empire" />

                        <RoleSwitcher role={role} setRole={setRole} />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">First Name</label>
                                    <Input className="bg-black/20 border-white/10 focus:border-primary/50 transition-all" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Last Name</label>
                                    <Input className="bg-black/20 border-white/10 focus:border-primary/50 transition-all" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Work Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input className="pl-10 bg-black/20 border-white/10 focus:border-primary/50 transition-all" type="email" placeholder="name@company.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input className="pl-10 bg-black/20 border-white/10 focus:border-primary/50 transition-all" type="password" placeholder="Create a strong password" />
                                </div>
                            </div>

                            {/* Optional Telegram ID */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Telegram ID</label>
                                <div className="relative group">
                                    <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input className="pl-10 bg-black/20 border-white/10 focus:border-primary/50 transition-all" placeholder="@username" />
                                </div>
                            </div>


                            <Button variant="glow" className="w-full py-6 text-lg group shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" size="lg" isLoading={isLoading}>
                                Create Account
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </form>

                        <Footer text="Already have an account?" action="Sign In" onClick={toggleMode} />
                    </div>
                </CardFace>
            </motion.div>
        </div>
    )
}

function CardFace({ children, mode, isFlipped }: { children: React.ReactNode, mode: "login" | "register", isFlipped: boolean }) {
    return (
        <div
            className="w-full backface-hidden bg-card/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            style={{
                minHeight: "650px", // Ensure consistent height
                backfaceVisibility: "hidden",
                transform: mode === "register" ? "rotateY(180deg)" : "none",
                position: mode === "register" ? "absolute" : "relative",
                top: 0,
                left: 0,
            }}
        >
            {/* Top lighting effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

            {children}
        </div>
    )
}

function Header({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 justify-center mb-6 group">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all shadow-inner border border-white/5">
                    <Gamepad2 className="h-6 w-6 text-primary" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-foreground">NexusPlay</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
        </div>
    )
}

function RoleSwitcher({ role, setRole }: { role: Role, setRole: (r: Role) => void }) {
    return (
        <div className="grid grid-cols-2 p-1.5 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 relative">
            {/* Sliding Background */}
            <motion.div
                className="absolute top-1.5 bottom-1.5 rounded-xl bg-primary shadow-lg shadow-primary/25 z-0"
                initial={false}
                animate={{
                    left: role === "AGENT" ? "6px" : "50%",
                    width: "calc(50% - 6px)",
                    x: role === "AFFILIATE" ? -2 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            <button
                onClick={() => setRole("AGENT")}
                className={`relative z-10 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl transition-colors ${role === "AGENT" ? "text-white" : "text-muted-foreground hover:text-white"}`}
            >
                <User className="h-4 w-4" />
                Agent
            </button>
            <button
                onClick={() => setRole("AFFILIATE")}
                className={`relative z-10 flex items-center justify-center gap-2 text-sm font-medium py-3 rounded-xl transition-colors ${role === "AFFILIATE" ? "text-white" : "text-muted-foreground hover:text-white"}`}
            >
                <Users className="h-4 w-4" />
                Affiliate
            </button>
        </div>
    )
}

function Footer({ text, action, onClick }: { text: string, action: string, onClick: () => void }) {
    return (
        <div className="text-center text-sm text-muted-foreground pt-6 border-t border-white/5">
            {text}{" "}
            <button onClick={onClick} className="text-primary hover:text-primary/80 hover:underline font-bold focus:outline-none ml-1">
                {action}
            </button>
        </div>
    )
}
