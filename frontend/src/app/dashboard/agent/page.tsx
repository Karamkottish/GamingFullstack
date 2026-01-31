"use client"

import { useState } from "react"
import { Users, Wallet, TrendingUp, AlertCircle, RefreshCcw, Landmark, Percent, Zap } from "lucide-react"
import { Card } from "@/components/ui/Card"
import dynamic from 'next/dynamic'
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Skeleton } from "@/components/ui/Skeleton"
import { useAgentStats, useRevenueAnalytics } from "@/hooks/useAgentDashboard"
import { Button } from "@/components/ui/Button"
import { motion, AnimatePresence } from "framer-motion"

// Dynamic imports with premium loading states
const UserGlobe = dynamic(() => import('@/components/dashboard/UserGlobe').then(mod => mod.UserGlobe), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-4">
            <Skeleton variant="circular" width="200px" height="200px" />
            <Skeleton width="150px" height="12px" />
        </div>
    )
})

const AgentRevenueChart = dynamic<any>(() => import('@/components/dashboard/charts/AgentRevenueChart'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[300px] flex flex-col justify-end p-6 space-y-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-end gap-2 h-40">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} width="100%" height={`${Math.random() * 100}%`} className="rounded-t-md" />
                ))}
            </div>
            <div className="flex justify-between">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} width="40px" height="10px" />
                ))}
            </div>
        </div>
    )
})

export default function AgentDashboard() {
    const { data: stats, isLoading, error, refetch } = useAgentStats()
    const { data: analytics, isLoading: isChartLoading } = useRevenueAnalytics('7d')

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 bg-red-500/5 rounded-3xl border border-red-500/10 p-12">
                <div className="p-4 bg-red-500/10 rounded-full">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Dashboard Unavailable</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        We encountered an issue while fetching your network statistics. Please check your connection or try again.
                    </p>
                </div>
                <Button variant="glow" onClick={() => refetch()} className="flex items-center gap-2 h-11 px-8">
                    <RefreshCcw className="h-4 w-4" /> Reconnect
                </Button>
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <div className="space-y-8 pb-12">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2"
                >
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Agent Overview
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                        Monitor your network's growth, revenue streams, and commission performance in real-time.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Network Size"
                        value={isLoading ? "..." : (stats?.total_users?.toLocaleString() || "0")}
                        subValue={isLoading ? "" : `${stats?.active_users || 0} active now`}
                        icon={<Users className="h-5 w-5 text-indigo-400" />}
                        isLoading={isLoading}
                        gradient="from-indigo-500/20 to-transparent"
                    />
                    <StatsCard
                        title="Monthly Revenue"
                        value={isLoading ? "..." : `$${stats?.this_month_revenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0.00"}`}
                        subValue={isLoading ? "" : `Total: $${stats?.total_revenue?.toLocaleString() || "0"}`}
                        icon={<Zap className="h-5 w-5 text-amber-400" />}
                        isLoading={isLoading}
                        gradient="from-amber-500/20 to-transparent"
                    />
                    <StatsCard
                        title="Unsettled Commission"
                        value={isLoading ? "..." : `$${stats?.pending_commission?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0.00"}`}
                        subValue={isLoading ? "" : `Settling weekly`}
                        icon={<Landmark className="h-5 w-5 text-emerald-400" />}
                        isLoading={isLoading}
                        gradient="from-emerald-500/20 to-transparent"
                    />
                    <StatsCard
                        title="Available Payout"
                        value={isLoading ? "..." : `$${stats?.withdrawable_balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0.00"}`}
                        subValue={isLoading ? "" : "Ready to withdraw"}
                        icon={<Wallet className="h-5 w-5 text-blue-400" />}
                        isLoading={isLoading}
                        gradient="from-blue-500/20 to-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-7 2xl:grid-cols-8 gap-8">
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-4 2xl:col-span-5 bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-white">Revenue Analytics</h3>
                                    <p className="text-xs text-indigo-400/60 font-medium tracking-wide uppercase">PAST 7 DAYS PERFORMANCE</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">Live Updates</span>
                                </div>
                            </div>
                            <AgentRevenueChart data={analytics} isLoading={isChartLoading} />
                        </div>
                    </motion.div>

                    {/* Globe & Network Visualizer */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-3 2xl:col-span-3 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-xl relative overflow-hidden flex flex-col min-h-[450px] shadow-2xl group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent pointer-events-none" />
                        <div className="p-8 pb-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                <h3 className="text-xl font-black text-white">Global Reach</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold opacity-60">Real-time Network Footprint</p>
                        </div>
                        <div className="flex-1 relative">
                            <UserGlobe />
                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active nodes</p>
                                        <p className="text-lg font-black text-white">{stats?.active_users || 0}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Retention</p>
                                        <p className="text-lg font-black text-white">88%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

function StatsCard({ title, value, subValue, icon, isLoading, gradient }: { title: string, value: string, subValue: string, icon: React.ReactNode, isLoading?: boolean, gradient: string }) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-[1px] rounded-3xl bg-gradient-to-br from-white/10 to-white/5 group transition-all"
        >
            <Card className={`h-full p-8 bg-black/40 border-none rounded-[23px] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-xl`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} blur-3xl rounded-full opacity-60 pointer-events-none group-hover:scale-150 transition-transform duration-500`} />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-primary/20 group-hover:border-primary/30 transition-all shadow-inner">
                            {icon}
                        </div>
                        <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-tighter">
                            +12%
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors">
                            {title}
                        </h3>
                        <div className="text-3xl font-black text-white tracking-tight">
                            {isLoading ? <Skeleton width="120px" height="32px" className="mt-2" /> : value}
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                    <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-2">
                        {isLoading ? <Skeleton width="80px" height="10px" /> : (
                            <>
                                <span className="h-1 w-1 rounded-full bg-indigo-400" />
                                {subValue}
                            </>
                        )}
                    </p>
                </div>
            </Card>
        </motion.div>
    )
}
