"use client"

import { useState } from "react"
import { Download, Calendar, DollarSign, Filter, RefreshCcw, History, TrendingUp, Wallet, ArrowUpRight, CheckCircle2, AlertCircle, Clock, ChevronLeft, ChevronRight, Landmark } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Skeleton } from "@/components/ui/Skeleton"
import { useCommissions, useRequestPayout } from "@/hooks/useAgentDashboard"
import { useWallet } from "@/hooks/useWallet"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function AgentCommissionPage() {
    const [page, setPage] = useState(1)
    const [pageSize] = useState(20)
    const [isPayoutOpen, setIsPayoutOpen] = useState(false)

    // Payout form state
    const [payoutAmount, setPayoutAmount] = useState("")
    const [payoutMethod, setPayoutMethod] = useState<'BANK' | 'CRYPTO' | 'USDT'>('USDT')
    const [walletAddress, setWalletAddress] = useState("")

    const { data: commissionsData, isLoading, error, refetch } = useCommissions(page, pageSize)
    const { data: wallet, isLoading: isWalletLoading } = useWallet()
    const payoutMutation = useRequestPayout()

    const handleRequestPayout = (e: React.FormEvent) => {
        e.preventDefault()
        const amount = parseFloat(payoutAmount)

        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        if (amount > (wallet?.commission_balance || 0)) {
            toast.error("Insufficient balance")
            return
        }

        payoutMutation.mutate({
            amount,
            method: payoutMethod,
            wallet_address: walletAddress
        }, {
            onSuccess: () => {
                setIsPayoutOpen(false)
                setPayoutAmount("")
                setWalletAddress("")
            }
        })
    }

    const totalPages = Math.ceil((commissionsData?.total || 0) / pageSize)

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 bg-amber-500/5 rounded-3xl border border-amber-500/10 p-12">
                <div className="p-4 bg-amber-500/10 rounded-full">
                    <History className="h-12 w-12 text-amber-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Settlement Sync Failed</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        We couldn't synchronize your commission history. Your earnings are safe, but we're having trouble displaying them right now.
                    </p>
                </div>
                <Button variant="glow" onClick={() => refetch()} className="flex items-center gap-2 h-11 px-8">
                    <RefreshCcw className="h-4 w-4" /> Retry Sync
                </Button>
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <div className="space-y-8 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white">Financial Hub</h1>
                        <p className="text-muted-foreground mt-1">Track settlements, manage payouts, and analyze your net earnings.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="h-11 px-5 border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest gap-2">
                            <Calendar className="h-4 w-4" /> Date Range
                        </Button>
                        <Button variant="outline" className="h-11 px-5 border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest gap-2">
                            <Download className="h-4 w-4" /> Export Ledger
                        </Button>
                    </div>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-[1px] rounded-3xl bg-gradient-to-br from-emerald-500/40 to-emerald-600/10"
                    >
                        <Card className="h-full p-8 bg-black/40 border-none rounded-[23px] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">Available Funds</p>
                                        <h3 className="text-4xl font-black text-white tracking-tight">
                                            {isWalletLoading ? <Skeleton width="150px" height="40px" /> : `$${wallet?.commission_balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0.00"}`}
                                        </h3>
                                    </div>
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                                        <DollarSign className="h-6 w-6" />
                                    </div>
                                </div>
                                <Button
                                    variant="glow"
                                    onClick={() => setIsPayoutOpen(true)}
                                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-[0_8px_32px_rgba(16,185,129,0.3)] font-bold text-sm tracking-wide gap-2 group-hover:scale-[1.02] transition-transform"
                                >
                                    Withdraw Now <ArrowUpRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>

                    <CardCard
                        title="Lifetime Earnings"
                        value={isWalletLoading ? "..." : `$${wallet?.total_earned?.toLocaleString() || "0"}`}
                        subText="All-time accumulated commission"
                        icon={<TrendingUp className="h-5 w-5 text-indigo-400" />}
                        delay={0.2}
                    />

                    <CardCard
                        title="Current Agent Tier"
                        value="30%"
                        subText="Tier: Gold Affiliate"
                        icon={<Percent className="h-5 w-5 text-amber-400" />}
                        delay={0.3}
                        badge="LEVEL 4"
                    />
                </div>

                {/* Ledger Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="bg-black/30 border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                    <History className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Settlement Ledger</h3>
                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest opacity-60">AUDIT TRAIL</p>
                                </div>
                            </div>
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-muted-foreground uppercase text-[10px] tracking-widest font-black">
                                    <tr>
                                        <th className="px-8 py-5">Transaction ID</th>
                                        <th className="px-8 py-5">Origin / User</th>
                                        <th className="px-8 py-5">Revenue</th>
                                        <th className="px-8 py-5">Share</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-right">Commission</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <AnimatePresence mode="popLayout">
                                        {isLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i} className="animate-pulse">
                                                    <td colSpan={6} className="px-8 py-6"><Skeleton width="100%" height="20px" /></td>
                                                </tr>
                                            ))
                                        ) : commissionsData?.commissions.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground">
                                                    <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                                    <p className="text-sm font-medium opacity-50">No commission records found in your ledger.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            commissionsData?.commissions.map((txn) => (
                                                <motion.tr
                                                    key={txn.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="group hover:bg-white/[0.03] transition-colors"
                                                >
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                                                                <Landmark className="h-4 w-4 text-indigo-400/60" />
                                                            </div>
                                                            <span className="font-mono text-[11px] font-bold text-indigo-400 capitalize">{txn.id.slice(0, 8)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 font-bold text-white tracking-wide">{txn.user_name}</td>
                                                    <td className="px-8 py-6 font-mono text-xs text-muted-foreground">${txn.revenue_generated.toLocaleString()}</td>
                                                    <td className="px-8 py-6">
                                                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-white/50">{txn.commission_rate}%</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${txn.status === 'PAID'
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                            }`}>
                                                            {txn.status === 'PAID' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                            {txn.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className="text-lg font-black text-white tracking-tight">${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                                SHOWING {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, commissionsData?.total || 0)} OF {commissionsData?.total || 0} RECORDS
                            </p>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1 || isLoading}
                                    onClick={() => setPage(p => p - 1)}
                                    className="h-9 px-4 rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="text-[10px] font-black text-white bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/30 uppercase tracking-widest">
                                    PAGE {page} / {totalPages || 1}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages || isLoading}
                                    onClick={() => setPage(p => p + 1)}
                                    className="h-9 px-4 rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Payout Modal */}
                <Modal
                    isOpen={isPayoutOpen}
                    onClose={() => setIsPayoutOpen(false)}
                    title="Initialize Settlement"
                >
                    <div className="p-8">
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 text-center mb-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full" />
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Maximum Withdrawable</p>
                            <h2 className="text-4xl font-black text-white tracking-tight group-hover:scale-110 transition-transform duration-500">
                                ${wallet?.commission_balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0.00"}
                            </h2>
                        </div>

                        <form onSubmit={handleRequestPayout} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Settlement Amount (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={payoutAmount}
                                        onChange={(e) => setPayoutAmount(e.target.value)}
                                        className="h-14 pl-12 bg-black/40 border-white/10 focus:border-indigo-500/50 rounded-2xl text-lg font-bold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPayoutAmount(wallet?.commission_balance.toString() || "0")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-400 uppercase hover:text-indigo-300 transition-colors"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Settlement Method</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['BANK', 'CRYPTO', 'USDT'] as const).map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setPayoutMethod(method)}
                                            className={`h-12 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${payoutMethod === method
                                                    ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                                                    : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                                                }`}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Extraction Destination</label>
                                <Input
                                    placeholder={payoutMethod === 'BANK' ? "IBAN / SWIFT Code" : "Recipient Wallet Address"}
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                    className="h-14 bg-black/40 border-white/10 focus:border-indigo-500/50 rounded-2xl font-mono text-sm"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl text-xs font-black uppercase tracking-widest"
                                    onClick={() => setIsPayoutOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="glow"
                                    isLoading={payoutMutation.isPending}
                                    className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-900/20"
                                >
                                    Request Payout
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </ErrorBoundary>
    )
}

function CardCard({ title, value, subText, icon, delay, badge }: { title: string, value: string, subText: string, icon: React.ReactNode, delay: number, badge?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card className="h-full p-8 bg-black/40 border-white/10 rounded-[28px] backdrop-blur-xl relative overflow-hidden group shadow-xl">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-primary/10 transition-all">
                        {icon}
                    </div>
                    {badge && (
                        <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-[9px] font-black text-indigo-400 tracking-tighter uppercase whitespace-nowrap">
                            {badge}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 opacity-60">{title}</p>
                    <h3 className="text-3xl font-black text-white tracking-tight group-hover:text-primary transition-colors">{value}</h3>
                    <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-indigo-400/40" />
                        {subText}
                    </p>
                </div>
            </Card>
        </motion.div>
    )
}
