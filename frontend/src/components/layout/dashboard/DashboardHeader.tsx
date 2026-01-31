"use client"
import { Bell, Search, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export function DashboardHeader({ role }: { role: string }) {
    return (
        <header className="h-16 border-b border-white/10 bg-black/60 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4 w-96">
                <div className="relative w-full group">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search..."
                        className="pl-9 bg-white/5 border-transparent focus:bg-black/40 focus:border-primary/20 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-muted-foreground hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                </button>

                <div className="h-8 w-[1px] bg-white/10" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white">John Doe</p>
                        <p className="text-xs text-muted-foreground capitalize">{role.toLowerCase()}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-violet-600 p-[1px]">
                        <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                            <UserCircle className="h-full w-full text-white/80" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
