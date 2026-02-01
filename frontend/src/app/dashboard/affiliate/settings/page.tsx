"use client"
import { User, Mail, Phone, MapPin, Calendar, Shield, Award, TrendingUp, Wallet, Settings, Bell, Lock, Eye, EyeOff, Check, X, Clock, Zap } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useAffiliateStats, useAffiliateWallet, useAffiliatePayouts, useApprovePayout, useRejectPayout } from "@/hooks/useAffiliateDashboard"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function AffiliateProfilePage() {
    const { data: stats } = useAffiliateStats()
    const { data: wallet } = useAffiliateWallet()
    const { data: payoutsData } = useAffiliatePayouts(1, 10)
    const approvePayout = useApprovePayout()
    const rejectPayout = useRejectPayout()

    const [showPassword, setShowPassword] = useState(false)
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'payouts'>('profile')
    const [rejectReason, setRejectReason] = useState("")
    const [selectedPayout, setSelectedPayout] = useState<string | null>(null)

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
            case 'APPROVED': return 'text-green-400 bg-green-500/10 border-green-500/20'
            case 'REJECTED': return 'text-red-400 bg-red-500/10 border-red-500/20'
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock className="h-4 w-4" />
            case 'APPROVED': return <Check className="h-4 w-4" />
            case 'REJECTED': return <X className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    return (
        <div className="min-h-screen space-y-8">
            {/* Hero Section with Glassmorphism */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-xl border border-white/10 p-8"
            >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 animate-pulse" />

                <div className="relative z-10 flex items-start gap-8">
                    {/* Avatar with Glow Effect */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
                        <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                            <User className="h-16 w-16" />
                        </div>
                        <div className="absolute bottom-0 right-0 h-8 w-8 bg-green-500 rounded-full border-4 border-black flex items-center justify-center">
                            <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                                Affiliate Partner
                            </h1>
                            <p className="text-muted-foreground flex items-center gap-2 mt-2">
                                <Mail className="h-4 w-4" />
                                affiliate@nexusplay.com
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Revenue</p>
                                        <p className="text-xl font-bold text-white">${stats?.total_revenue || '0.00'}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <Wallet className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Available</p>
                                        <p className="text-xl font-bold text-white">${wallet?.available_balance || '0.00'}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                        <Award className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Conversions</p>
                                        <p className="text-xl font-bold text-white">{(stats?.registrations || 0) + (stats?.ftd_count || 0)}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 w-fit">
                {[
                    { id: 'profile', label: 'Profile', icon: User },
                    { id: 'security', label: 'Security', icon: Shield },
                    { id: 'payouts', label: 'Payout Management', icon: Wallet }
                ].map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                            ? 'text-white'
                            : 'text-muted-foreground hover:text-white'
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <tab.icon className="h-4 w-4 relative z-10" />
                        <span className="relative z-10">{tab.label}</span>
                    </motion.button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-2 gap-6"
                    >
                        <Card className="p-6 bg-black/40 backdrop-blur-sm border-white/10">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-purple-400" />
                                Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Full Name</label>
                                    <Input
                                        defaultValue="Affiliate Partner"
                                        className="bg-white/5 border-white/10 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                                    <Input
                                        defaultValue="affiliate@nexusplay.com"
                                        className="bg-white/5 border-white/10 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Phone</label>
                                    <Input
                                        defaultValue="+1 (555) 123-4567"
                                        className="bg-white/5 border-white/10 focus:border-purple-500"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-black/40 backdrop-blur-sm border-white/10">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-pink-400" />
                                Location & Preferences
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Country</label>
                                    <Input
                                        defaultValue="United States"
                                        className="bg-white/5 border-white/10 focus:border-pink-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Timezone</label>
                                    <Input
                                        defaultValue="UTC-5 (EST)"
                                        className="bg-white/5 border-white/10 focus:border-pink-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Language</label>
                                    <Input
                                        defaultValue="English"
                                        className="bg-white/5 border-white/10 focus:border-pink-500"
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'security' && (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-2 gap-6"
                    >
                        <Card className="p-6 bg-black/40 backdrop-blur-sm border-white/10">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Lock className="h-5 w-5 text-blue-400" />
                                Change Password
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Current Password</label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            className="bg-white/5 border-white/10 focus:border-blue-500 pr-10"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">New Password</label>
                                    <Input
                                        type="password"
                                        className="bg-white/5 border-white/10 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Confirm Password</label>
                                    <Input
                                        type="password"
                                        className="bg-white/5 border-white/10 focus:border-blue-500"
                                    />
                                </div>
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                                    Update Password
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6 bg-black/40 backdrop-blur-sm border-white/10">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Bell className="h-5 w-5 text-amber-400" />
                                Notifications
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Email Notifications', desc: 'Receive updates via email' },
                                    { label: 'Payout Alerts', desc: 'Get notified about payouts' },
                                    { label: 'Performance Reports', desc: 'Weekly performance summaries' },
                                    { label: 'Marketing Updates', desc: 'New campaigns and promotions' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div>
                                            <p className="font-medium text-white">{item.label}</p>
                                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                                        </div>
                                        <div className="relative">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'payouts' && (
                    <motion.div
                        key="payouts"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <Card className="p-6 bg-black/40 backdrop-blur-sm border-white/10">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-purple-400" />
                                Payout Requests Management
                            </h3>

                            {payoutsData?.payouts && payoutsData.payouts.length > 0 ? (
                                <div className="space-y-4">
                                    {payoutsData.payouts.map((payout: any) => (
                                        <motion.div
                                            key={payout.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="relative group"
                                        >
                                            {/* Glow Effect */}
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500" />

                                            <div className="relative bg-black/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(payout.status)}`}>
                                                                {getStatusIcon(payout.status)}
                                                                {payout.status}
                                                            </div>
                                                            <span className="text-muted-foreground text-sm">
                                                                {new Date(payout.requested_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                                            ${parseFloat(payout.amount).toFixed(2)}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Method: <span className="text-white font-medium">{payout.method}</span>
                                                        </p>
                                                        {payout.destination && (
                                                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                                                                {payout.destination}
                                                            </p>
                                                        )}
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
                                    <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                    <p className="text-muted-foreground">No payout requests yet</p>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
