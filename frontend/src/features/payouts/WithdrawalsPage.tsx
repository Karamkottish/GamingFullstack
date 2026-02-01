"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Wallet,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    ArrowRight,
    ShieldCheck,
    History,
    AlertCircle,
    Info,
    ChevronRight,
    Search,
    Filter,
    CreditCard,
    Cpu,
    Briefcase,
    Landmark
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { useWallet } from "@/hooks/useWallet"
import { usePayoutHistory, useRequestPayout, useApprovePayout, useRejectPayout, useSeedWallet } from "@/hooks/useAgentDashboard"
import { Skeleton } from "@/components/ui/Skeleton"
import { toast } from "sonner"

export function WithdrawalsPage() {
    const { data: wallet, isLoading: isWalletLoading } = useWallet()
    const { data: payoutHistory, isLoading: isHistoryLoading } = usePayoutHistory(1, 10)
    const requestPayout = useRequestPayout()
    const approvePayout = useApprovePayout()
    const rejectPayout = useRejectPayout()
    const seedWallet = useSeedWallet()

    const [amount, setAmount] = useState("")
    const [method, setMethod] = useState("USDT")
    const [address, setAddress] = useState("")
    const [showAdminSim, setShowAdminSim] = useState(false)

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        try {
            await requestPayout.mutateAsync({
                amount: parseFloat(amount),
                method: method as any,
                wallet_address: address
            })
            setAmount("")
            setAddress("")
        } catch (err) {
            // Error handled by mutation
        }
    }

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Capital Distribution
                </h1>
                <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                    Manage your liquidity, track withdrawal cycles, and optimize your commission payload.
                </p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Side: Request & Balance */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Available Balance Card */}
                    <Card className="p-8 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                <Wallet className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Liquid Balance</p>
                            <h2 className="text-5xl font-black text-white tracking-tighter">
                                {isWalletLoading ? <Skeleton width="180px" height="48px" /> : `$${wallet?.commission_balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                            </h2>

                            {/* QUICK SEED BUTTON (Testing Only) */}
                            <button
                                onClick={() => seedWallet.mutate(5000)}
                                className="mt-4 px-3 py-1 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                                disabled={seedWallet.isPending}
                            >
                                {seedWallet.isPending ? "Seeding..." : "+ Quick Seed $5,000"}
                            </button>

                            <div className="mt-6 w-full grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                                <div className="text-left">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Pending</p>
                                    <p className="text-lg font-black text-white">${wallet?.pending_payouts?.toLocaleString() || "0"}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Withdrawn</p>
                                    <p className="text-lg font-black text-white">${wallet?.total_withdrawn?.toLocaleString() || "0"}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Withdrawal Form */}
                    <Card className="p-8 bg-black/40 border-white/10 backdrop-blur-xl relative group">
                        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                            Initialize Payout
                        </h3>

                        <form onSubmit={handleRequest} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Transmission Amount</label>
                                <div className="relative group/input">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="pl-12 h-14 bg-white/5 border-white/10 focus:border-primary/50 text-xl font-bold rounded-2xl transition-all"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Protocol / Network</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <MethodButton
                                        active={method === "USDT"}
                                        onClick={() => setMethod("USDT")}
                                        icon={<Cpu className="h-4 w-4" />}
                                        label="USDT"
                                    />
                                    <MethodButton
                                        active={method === "CRYPTO"}
                                        onClick={() => setMethod("CRYPTO")}
                                        icon={<Info className="h-4 w-4" />}
                                        label="CRYPTO"
                                    />
                                    <MethodButton
                                        active={method === "BANK"}
                                        onClick={() => setMethod("BANK")}
                                        icon={<Landmark className="h-4 w-4" />}
                                        label="BANK"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Destination Address / IBAN</label>
                                <Input
                                    placeholder={method === "BANK" ? "Enter IBAN" : "Enter Wallet Address"}
                                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-amber-200/80 leading-relaxed font-medium">
                                    Funds will be locked upon submission. Verification takes 12-24 hours for security protocols.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                variant="glow"
                                className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em]"
                                isLoading={requestPayout.isPending}
                            >
                                Execute Withdrawal <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Right Side: History & Simulation */}
                <div className="xl:col-span-8 space-y-8">
                    {/* Admin Simulation Toggle (Demo Secret) */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowAdminSim(!showAdminSim)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold text-muted-foreground hover:text-white transition-all uppercase tracking-widest"
                        >
                            <ShieldCheck className={`h-4 w-4 ${showAdminSim ? "text-primary" : ""}`} />
                            {showAdminSim ? "Deactivate Admin View" : "Simulate Admin Oversight"}
                        </button>
                    </div>

                    {/* Transaction Registry */}
                    <Card className="bg-black/40 border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <h3 className="text-xl font-black text-white flex items-center gap-3">
                                <History className="h-5 w-5 text-primary" />
                                Payout Registry
                            </h3>
                            <div className="flex gap-4">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        className="h-9 w-48 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-primary/50 transition-all"
                                        placeholder="Filter by ID..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="px-8 py-5">Transaction ID</th>
                                        <th className="px-6 py-5">Timestamp</th>
                                        <th className="px-6 py-5">Mechanism</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5 text-right">Magnitude</th>
                                        {showAdminSim && <th className="px-8 py-5 text-center">Admin Controls</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <AnimatePresence mode="popLayout">
                                        {isHistoryLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i}>
                                                    <td className="px-8 py-6"><Skeleton width="120px" height="12px" /></td>
                                                    <td className="px-6 py-6"><Skeleton width="80px" height="12px" /></td>
                                                    <td className="px-6 py-6"><Skeleton width="60px" height="12px" /></td>
                                                    <td className="px-6 py-6"><Skeleton width="100px" height="20px" className="rounded-full" /></td>
                                                    <td className="px-6 py-6 text-right"><Skeleton width="80px" height="12px" /></td>
                                                </tr>
                                            ))
                                        ) : payoutHistory?.payouts?.length === 0 ? (
                                            <tr>
                                                <td colSpan={showAdminSim ? 6 : 5} className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="p-4 bg-white/5 rounded-full">
                                                            <Clock className="h-10 w-10 text-muted-foreground/30" />
                                                        </div>
                                                        <p className="text-muted-foreground font-medium">No payouts initiated in current cycle.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            payoutHistory?.payouts?.map((payout) => (
                                                <motion.tr
                                                    key={payout.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="group hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <td className="px-8 py-6">
                                                        <span className="font-mono text-[11px] text-primary/80 font-bold tracking-widest">
                                                            #{payout.id.toString().substring(0, 8).toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <p className="text-xs text-white font-medium">
                                                            {new Date(payout.requested_at).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            {new Date(payout.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/30 transition-colors">
                                                                {payout.method === "BANK" ? <Landmark className="h-3 w-3" /> : <Cpu className="h-3 w-3" />}
                                                            </div>
                                                            <span className="text-[11px] font-black text-white uppercase tracking-tighter">
                                                                {payout.method}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <StatusBadge status={payout.status} />
                                                        {payout.rejection_reason && (
                                                            <p className="text-[10px] text-red-400/60 mt-1 max-w-[150px] truncate" title={payout.rejection_reason}>
                                                                Reason: {payout.rejection_reason}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-6 text-right font-black text-white text-base">
                                                        ${payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </td>
                                                    {showAdminSim && (
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center justify-center gap-2">
                                                                {payout.status === 'PENDING' ? (
                                                                    <>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => approvePayout.mutate(payout.id)}
                                                                            className="h-8 px-3 rounded-lg border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-[10px] uppercase font-black"
                                                                            isLoading={approvePayout.isPending && approvePayout.variables === payout.id}
                                                                        >
                                                                            Approve
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => rejectPayout.mutate({ payoutId: payout.id, reason: "Manual demo rejection" })}
                                                                            className="h-8 px-3 rounded-lg border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 text-[10px] uppercase font-black"
                                                                            isLoading={rejectPayout.isPending && rejectPayout.variables?.payoutId === payout.id}
                                                                        >
                                                                            Reject
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-[10px] font-black text-muted-foreground uppercase opacity-30">Processed</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function MethodButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${active
                ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(124,58,237,0.3)] text-white"
                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20"
                }`}
        >
            <div className={`p-2 rounded-xl transition-colors ${active ? "bg-primary/30" : "bg-white/5"}`}>
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </button>
    )
}

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { icon: any, color: string, bg: string }> = {
        PENDING: { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
        PAID: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        COMPLETED: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        REJECTED: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
        FAILED: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
    }

    const config = configs[status] || configs.PENDING

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${config.color} ${config.bg} border border-current/10`}>
            <config.icon className="h-3 w-3" />
            {status}
        </span>
    )
}
