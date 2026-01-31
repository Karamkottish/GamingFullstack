"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
    LayoutDashboard,
    Users,
    Wallet,
    PieChart,
    Settings,
    LogOut,
    Gamepad2,
    Link as LinkIcon,
    FileBarChart
} from "lucide-react"

type Role = "AGENT" | "AFFILIATE"

export function Sidebar({ role }: { role: Role }) {
    const pathname = usePathname()

    const agentLinks = [
        { href: "/dashboard/agent", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/agent/users", label: "User Management", icon: Users },
        { href: "/dashboard/agent/commission", label: "Commission", icon: Wallet },
        { href: "/dashboard/agent/settings", label: "Settings", icon: Settings },
    ]

    const affiliateLinks = [
        { href: "/dashboard/affiliate", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/affiliate/links", label: "Referral Links", icon: LinkIcon },
        { href: "/dashboard/affiliate/marketing", label: "Marketing Assets", icon: FileBarChart },
        { href: "/dashboard/affiliate/payouts", label: "Payouts", icon: Wallet },
        { href: "/dashboard/affiliate/settings", label: "Settings", icon: Settings },
    ]

    const links = role === "AGENT" ? agentLinks : affiliateLinks

    return (
        <aside className="h-full w-full bg-black/60 backdrop-blur-xl border-r border-white/10 flex flex-col">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Gamepad2 className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Nexus<span className="text-primary">Play</span></span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 pt-6">
                {links.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${isActive ? "text-white" : "text-muted-foreground hover:text-white"
                                }`}
                        >
                            {/* Active Glow Background */}
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <link.icon className={`h-5 w-5 relative z-10 transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`} />
                            <span className="font-medium relative z-10">{link.label}</span>

                            {/* Hover light effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/5 transition-opacity duration-300 rounded-xl" />
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <Link href="/auth/login" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                </Link>
            </div>
        </aside>
    )
}
