"use client"
import { DollarSign, Wallet, Clock, CheckCircle, XCircle, TrendingUp, Check, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { useAffiliateWallet, useAffiliatePayouts, useRequestPayout, useApprovePayout, useRejectPayout, useSeedWallet } from "@/hooks/useAffiliateDashboard"
import { useState } from "react"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function AffiliatePayoutsPage() {
    const { data: wallet, isLoading: walletLoading } = useAffiliateWallet()
    const { data: payoutsData, isLoading: payoutsLoading } = useAffiliatePayouts(1, 20)
    const requestPayout = useRequestPayout()
    const approvePayout = useApprovePayout()
    const rejectPayout = useRejectPayout()
    const seedWallet = useSeedWallet()

    const [amount, setAmount] = useState("")
    const [method, setMethod] = useState("CRYPTO")
    const [destination, setDestination] = useState("")
    const [selectedPayout, setSelectedPayout] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")

    const handleRequestPayout = async () => {
        const amountNum = parseFloat(amount)

        if (!amount || isNaN(amountNum) || amountNum <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        if (!destination.trim()) {
            toast.error("Please enter a destination address")
            return
        }

        try {
            await requestPayout.mutateAsync({
                amount,
                method,
                destination
            })
            setAmount("")
            setDestination("")
        } catch (error) {
            // Error handled by mutation
        }
    }

    const handleApprovePayout = async (payoutId: string) => {
        await approvePayout.mutateAsync(payoutId)
    }

    const handleRejectPayout = async (payoutId: string) => {
        if (!rejectReason.trim()) {
            toast.error("Please provide a rejection reason")
            return
        }
        await rejectPayout.mutateAsync({ payoutId, reason: rejectReason })
        setSelectedPayout(null)
        setRejectReason("")
    }

    const handleSeedWallet = async () => {
        await seedWallet.mutateAsync(5000)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="h-4 w-4 text-yellow-400" />
            case 'APPROVED':
                return <CheckCircle className="h-4 w-4 text-green-400" />
            case 'REJECTED':
                return <XCircle className="h-4 w-4 text-red-400" />
            default:
                return <Clock className="h-4 w-4 text-gray-400" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'text-yellow-400'
            case 'APPROVED':
                return 'text-green-400'
            case 'REJECTED':
                return 'text-red-400'
            default:
                return 'text-gray-400'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Payouts</h1>
                    <p className="text-muted-foreground">Request withdrawals and track your payout history.</p>
                </div>
                <Button
                    onClick={handleSeedWallet}
                    disabled={seedWallet.isPending}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white gap-2"
                >
                    <Wallet className="h-4 w-4" />
                    {seedWallet.isPending ? "Seeding..." : "Seed $5000 (Test)"}
                </Button>
            </div>

            {/* Wallet Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Wallet className="h-5 w-5 text-green-400" />
                        <h3 className="text-sm font-medium text-muted-foreground">Available Balance</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {walletLoading ? "..." : `$${parseFloat(wallet?.available_balance || "0").toFixed(2)}`}
                    </p>
                </Card>

                <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="h-5 w-5 text-yellow-400" />
                        <h3 className="text-sm font-medium text-muted-foreground">Pending Payouts</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {walletLoading ? "..." : `$${parseFloat(wallet?.pending_payouts || "0").toFixed(2)}`}
                    </p>
                </Card>

                <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        <h3 className="text-sm font-medium text-muted-foreground">Total Earned</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {walletLoading ? "..." : `$${parseFloat(wallet?.total_earned || "0").toFixed(2)}`}
                    </p>
                </Card>

                <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-purple-400" />
                        <h3 className="text-sm font-medium text-muted-foreground">Total Withdrawn</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {walletLoading ? "..." : `$${parseFloat(wallet?.total_withdrawn || "0").toFixed(2)}`}
                    </p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Request Payout Form */}
                <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm h-fit">
                    <h3 className="text-lg font-semibold text-white mb-4">Request Withdrawal</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Amount (USD)</label>
                            <Input
                                type="number"
                                placeholder="500.00"
                                className="bg-black/20"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Method</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                            >
                                <option value="CRYPTO">Cryptocurrency</option>
                                <option value="BANK">Bank Transfer</option>
                                <option value="USDT">USDT (TRC20)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">
                                {method === 'BANK' ? 'Account Details' : 'Wallet Address'}
                            </label>
                            <Input
                                placeholder={method === 'BANK' ? 'Bank account number' : '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'}
                                className="bg-black/20 font-mono text-xs"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-full"
                            variant="glow"
                            onClick={handleRequestPayout}
                            disabled={requestPayout.isPending}
                        >
                            <DollarSign className="h-4 w-4 mr-2" />
                            {requestPayout.isPending ? "Processing..." : "Request Payout"}
                        </Button>
                    </div>
                </Card>

                {/* Payout History */}
                <div className="lg:col-span-2">
                    <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Payout History {payoutsData && `(${payoutsData.total})`}
                        </h3>

                        {payoutsLoading ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <div className="animate-pulse">Loading payouts...</div>
                            </div>
                        ) : payoutsData && payoutsData.payouts.length > 0 ? (
                            <div className="space-y-4">
                                {payoutsData.payouts.map((payout) => (
                                    <motion.div
                                        key={payout.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative group"
                                    >
                                        {/* Glow Effect on Hover */}
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500" />

                                        <div className="relative bg-black/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="p-3 rounded-xl bg-primary/10">
                                                        {getStatusIcon(payout.status)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                                                ${parseFloat(payout.amount).toFixed(2)}
                                                            </h4>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payout.status)} bg-opacity-10`}>
                                                                {payout.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {payout.method} • {new Date(payout.requested_at).toLocaleDateString()}
                                                        </p>
                                                        {payout.destination && (
                                                            <p className="text-xs text-muted-foreground font-mono mt-1 truncate max-w-md">
                                                                {payout.destination}
                                                            </p>
                                                        )}
                                                        {payout.rejection_reason && (
                                                            <p className="text-xs text-red-400 mt-2 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                                                                ❌ Reason: {payout.rejection_reason}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {payout.status === 'PENDING' && (
                                                    <div className="flex gap-2">
                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <Button
                                                                onClick={() => handleApprovePayout(payout.id)}
                                                                disabled={approvePayout.isPending}
                                                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                                Approve
                                                            </Button>
                                                        </motion.div>
                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <Button
                                                                onClick={() => setSelectedPayout(payout.id)}
                                                                variant="outline"
                                                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 gap-2"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                Reject
                                                            </Button>
                                                        </motion.div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Rejection Form */}
                                            <AnimatePresence>
                                                {selectedPayout === payout.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mt-4 pt-4 border-t border-white/10"
                                                    >
                                                        <label className="text-sm text-muted-foreground mb-2 block">Rejection Reason</label>
                                                        <Input
                                                            value={rejectReason}
                                                            onChange={(e) => setRejectReason(e.target.value)}
                                                            placeholder="Enter reason for rejection..."
                                                            className="mb-3 bg-white/5 border-white/10 focus:border-red-500"
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => handleRejectPayout(payout.id)}
                                                                disabled={rejectPayout.isPending}
                                                                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                                                            >
                                                                Confirm Rejection
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    setSelectedPayout(null)
                                                                    setRejectReason("")
                                                                }}
                                                                variant="outline"
                                                                className="border-white/10"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <p className="text-muted-foreground">No payout requests yet</p>
                                <p className="text-sm text-muted-foreground/70 mt-1">Request your first withdrawal to get started</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}
