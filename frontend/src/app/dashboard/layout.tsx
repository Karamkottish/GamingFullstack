"use client"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/dashboard/Sidebar"
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader"

import { Toaster } from "sonner"
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    // Simple heuristic: if path contains 'affiliate', role is AFFILIATE, else AGENT
    const role = pathname?.includes("affiliate") ? "AFFILIATE" : "AGENT"

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <LiveActivityFeed />
            <Toaster position="bottom-right" theme="dark" />

            {/* Sidebar */}
            <Sidebar role={role} />

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
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
