"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { UserService } from "@/services/user.service"
import { User } from "@/services/auth.service"

import { useProfile } from "@/hooks/useProfile"

export function DashboardHeader({ role }: { role: string }) {
    const [hasMounted, setHasMounted] = useState(false)
    const router = useRouter()
    const { data: user } = useProfile()

    useEffect(() => {
        setHasMounted(true)
    }, [])

    const handleProfileClick = () => {
        const settingsPath = role === 'AGENT' ? '/dashboard/agent/settings' : '/dashboard/affiliate/settings'
        router.push(settingsPath)
    }

    const displayName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'Loading...'
    return (
        <header className="h-16 border-b border-border glass-panel flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4 w-96">
                <div className="relative w-full group">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search..."
                        className="pl-9 bg-muted/50 border-transparent focus:bg-card focus:border-primary/20 transition-all text-foreground"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-muted-foreground hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                </button>

                <ThemeToggle />

                <div className="h-8 w-[1px] bg-white/10" />

                <div className="flex items-center gap-3 cursor-pointer group" onClick={handleProfileClick}>
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{displayName}</p>
                        <p className="text-xs text-muted-foreground capitalize">{role.toLowerCase()}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-violet-600 p-[1px] group-hover:scale-110 transition-transform">
                        <div className="h-full w-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            <UserCircle className="h-full w-full text-foreground/80 group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
