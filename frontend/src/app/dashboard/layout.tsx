"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/dashboard/Sidebar"
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader"

import { Toaster } from "sonner"
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed"
import { Menu, X } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    // Simple heuristic: if path contains 'affiliate', role is AFFILIATE, else AGENT
    const role = pathname?.includes("affiliate") ? "AFFILIATE" : "AGENT"
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background text-foreground flex relative overflow-hidden">
            <LiveActivityFeed />
            <Toaster position="bottom-right" theme="dark" />

            {/* Mobile Header Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-white"
                    suppressHydrationWarning
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Sidebar - Hidden on mobile unless open */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:w-64 md:flex-shrink-0
                ${isMobileMenuOpen ? "translate-x-0 bg-black/90 backdrop-blur-xl" : "-translate-x-full"}
            `}>
                <Sidebar role={role} />
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-h-screen relative z-10 transition-all duration-300 w-full md:w-auto`}>
                <DashboardHeader role={role} />

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full space-y-6 animate-fade-in-up">
                        {children}
                    </div>
                </main>
            </div>

            {/* Background Ambience for Dashboard */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[100px]" />
            </div>
        </div>
    )
}
