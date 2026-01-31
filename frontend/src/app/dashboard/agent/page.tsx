"use client"
import { Users, Wallet, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/Card"
import dynamic from 'next/dynamic'

const UserGlobe = dynamic(() => import('@/components/dashboard/UserGlobe').then(mod => mod.UserGlobe), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs animate-pulse">Loading Globe...</div>
})

const AgentRevenueChart = dynamic(() => import('@/components/dashboard/charts/AgentRevenueChart'), {
    ssr: false,
    loading: () => <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground text-xs animate-pulse bg-white/5 rounded-xl">Loading Chart...</div>
})

export default function AgentDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Agent Dashboard</h1>
                <p className="text-muted-foreground">Overview of your network performance and commission status.</p>
            </div>

            {/* Stats Grid - 4K Optimized */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Users"
                    value="1,234"
                    change="+12% from last month"
                    icon={<Users className="h-4 w-4 text-violet-400" />}
                />
                <StatsCard
                    title="Total Revenue"
                    value="$45,231.89"
                    change="+20.1% from last month"
                    icon={<TrendingUp className="h-4 w-4 text-green-400" />}
                />
                <StatsCard
                    title="Pending Commission"
                    value="$2,400.00"
                    change="Due in 3 days"
                    icon={<Card className="h-4 w-4 text-amber-400" />}
                />
                <StatsCard
                    title="Withdrawable Balance"
                    value="$12,234.00"
                    change="Available now"
                    icon={<Wallet className="h-4 w-4 text-blue-400" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 2xl:grid-cols-8 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-4 2xl:col-span-5 bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-6">Revenue Overview (7 Days)</h3>
                    <AgentRevenueChart />
                </div>

                {/* Globe & Network Visualizer */}
                <div className="lg:col-span-3 2xl:col-span-3 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm relative overflow-hidden flex flex-col min-h-[400px]">
                    <div className="p-6 pb-0 z-10">
                        <h3 className="text-lg font-semibold text-white">Live Network</h3>
                        <p className="text-xs text-muted-foreground">Real-time active user sessions</p>
                    </div>
                    <div className="flex-1 min-h-[300px]">
                        <UserGlobe />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
    return (
        <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm hover:border-primary/20 transition-all group">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">
                    {title}
                </h3>
                {icon}
            </div>
            <div className="pt-2">
                <div className="text-2xl font-bold text-white">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{change}</p>
            </div>
        </Card>
    )
}
