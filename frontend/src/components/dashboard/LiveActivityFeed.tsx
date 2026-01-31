"use client"
import { useEffect } from "react"
import { toast } from "sonner"
import { Wallet, UserPlus, Globe, Gamepad2 } from "lucide-react"

const COUNTRIES = ["🇧🇷 Brazil", "🇬🇧 UK", "🇩🇪 Germany", "🇯🇵 Japan", "🇨🇦 Canada", "🇦🇺 Australia", "🇳🇬 Nigeria", "🇮🇳 India", "🇫🇷 France"]
const NAMES = ["AlexK", "CryptoKing", "BetMaster", "JaneDoe", "Winner99", "ProGamer", "LuckyStrike", "VipPlayer"]
const ACTIONS = [
    { type: "deposit", msgs: ["deposited $500", "deposited $1,200", "deposited $50", "deposited $2,500"], icon: Wallet, color: "text-green-400" },
    { type: "signup", msgs: ["just joined from"], icon: UserPlus, color: "text-violet-400" },
    { type: "win", msgs: ["won $450 on Slots", "won $120 on Roulette", "hit a $5,000 Jackpot"], icon: Gamepad2, color: "text-amber-400" },
]

export function LiveActivityFeed() {
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly select an action
            const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
            const name = NAMES[Math.floor(Math.random() * NAMES.length)]
            const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
            const msg = action.msgs[Math.floor(Math.random() * action.msgs.length)]

            const fullMessage = action.type === "signup" ? `${msg} ${country}` : msg

            toast.custom((t) => (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl w-64 animate-fade-in-up">
                    <div className={`p-2 rounded-lg bg-white/5 ${action.color}`}>
                        <action.icon className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">{name}</p>
                        <p className="text-xs text-muted-foreground">{fullMessage}</p>
                    </div>
                </div>
            ), { duration: 4000 })

        }, 8000) // Every 8 seconds

        return () => clearInterval(interval)
    }, [])

    return null
}
