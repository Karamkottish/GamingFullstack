"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useWallet } from '@/hooks/useWallet'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Skeleton } from '@/components/ui/Skeleton'
import { Edit2, Save, X, Wallet, Calendar, Mail, Phone, MessageCircle, Shield, CreditCard, LogOut, TrendingUp, DollarSign, ArrowDownToLine, AlertCircle } from 'lucide-react'
import { AuthService } from '@/services/auth.service'
import toast from 'react-hot-toast'

function ProfileSkeleton() {
    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <Skeleton variant="circular" width="128px" height="128px" />
                    <div className="space-y-3 flex-1">
                        <Skeleton width="200px" height="32px" />
                        <Skeleton width="150px" height="20px" />
                        <Skeleton width="300px" height="16px" />
                    </div>
                </div>
            </div>

            {/* Info Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-4">
                        <Skeleton width="80px" height="14px" className="mb-2" />
                        <Skeleton width="120px" height="24px" />
                    </div>
                ))}
            </div>

            {/* Edit Form Skeleton */}
            <div className="bg-card border border-border rounded-2xl p-8">
                <div className="space-y-4">
                    <Skeleton width="150px" height="24px" />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i}>
                            <Skeleton width="100px" height="14px" className="mb-2" />
                            <Skeleton width="100%" height="40px" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ProfileError({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md text-center"
            >
                <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full">
                        <AlertCircle className="h-12 w-12 text-red-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Failed to Load Profile</h2>
                <p className="text-muted-foreground mb-6">
                    We couldn't load your profile data. Please try again.
                </p>
                <button
                    onClick={onRetry}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                    Try Again
                </button>
            </motion.div>
        </div>
    )
}

export default function ProfilePage() {
    const { data: user, isLoading, error, refetch } = useProfile()
    const { data: wallet, isLoading: isWalletLoading } = useWallet()
    const updateProfile = useUpdateProfile()

    const [isEditing, setIsEditing] = useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    // Form state
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [telegramId, setTelegramId] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    // Initialize form when user data loads
    useState(() => {
        if (user) {
            setFirstName(user.first_name || '')
            setLastName(user.last_name || '')
            setTelegramId(user.telegram_id || '')
            setPhoneNumber(user.phone_number || '')
        }
    })

    const handleEdit = () => {
        if (user) {
            setFirstName(user.first_name || '')
            setLastName(user.last_name || '')
            setTelegramId(user.telegram_id || '')
            setPhoneNumber(user.phone_number || '')
        }
        setIsEditing(true)
    }

    const handleSave = () => {
        updateProfile.mutate(
            {
                first_name: firstName,
                last_name: lastName,
                telegram_id: telegramId,
                phone_number: phoneNumber
            },
            {
                onSuccess: () => {
                    setIsEditing(false)
                }
            }
        )
    }

    const handleCancel = () => {
        if (user) {
            setFirstName(user.first_name || '')
            setLastName(user.last_name || '')
            setTelegramId(user.telegram_id || '')
            setPhoneNumber(user.phone_number || '')
        }
        setIsEditing(false)
    }

    const handleLogout = () => {
        toast.success('Logging out...')
        setTimeout(() => {
            AuthService.logout()
        }, 500)
    }

    // Loading State
    if (isLoading) {
        return (
            <ErrorBoundary>
                <ProfileSkeleton />
            </ErrorBoundary>
        )
    }

    // Error State
    if (error || !user) {
        return (
            <ErrorBoundary>
                <ProfileError onRetry={() => refetch()} />
            </ErrorBoundary>
        )
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-background relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

                <div className="relative max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
                    {/* Page header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Profile & Settings
                        </h1>
                        <p className="text-muted-foreground mt-2">Manage your account information</p>
                    </motion.div>

                    {/* USER Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-card to-card/50 border border-border/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-6 shadow-xl"
                    >
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Avatar */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative"
                            >
                                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-5xl font-bold text-primary-foreground shadow-2xl ring-4 ring-primary/20">
                                    {user.first_name?.[0]}{user.last_name?.[0]}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-background"></div>
                            </motion.div>

                            {/* User Info */}
                            <div className="flex-1">
                                <h2 className="text-2xl md:text-3xl font-bold mb-1">{user.full_name || `${user.first_name} ${user.last_name}`}</h2>
                                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-sm md:text-base">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5
                                        ${user.role === 'AGENT' ? 'bg-primary/20 text-primary border border-primary/30' :
                                            user.role === 'AFFILIATE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                        <Shield className="h-3 w-3" />
                                        {user.role}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                            </div>

                            {/* Edit/Logout Buttons */}
                            <div className="flex gap-3 md:flex-col md:items-end">
                                {!isEditing ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleEdit}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-medium"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit Profile
                                    </motion.button>
                                ) : null}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 text-sm font-medium"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Info Cards Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                    >
                        <InfoCard icon={<Calendar className="h-5 w-5 text-blue-400" />} label="Member Since" value={new Date(user.created_at).toLocaleDateString()} />
                        <InfoCard icon={<Mail className="h-5 w-5 text-violet-400" />} label="Email" value={user.email} />
                        <InfoCard icon={<Phone className="h-5 w-5 text-green-400" />} label="Phone" value={user.phone_number || 'Not set'} />
                        <InfoCard icon={<MessageCircle className="h-5 w-5 text-cyan-400" />} label="Telegram" value={user.telegram_id || 'Not set'} />
                    </motion.div>

                    {/* Wallet Balance Section - AGENTS ONLY */}
                    {user.role === 'AGENT' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-6"
                        >
                            <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Wallet className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold">Wallet Balance</h3>
                                </div>

                                {isWalletLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                                <Skeleton width="120px" height="14px" className="mb-3" />
                                                <Skeleton width="100px" height="28px" className="mb-2" />
                                                <Skeleton width="60px" height="12px" />
                                            </div>
                                        ))}
                                    </div>
                                ) : wallet ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <WalletCard
                                            title="Commission Balance"
                                            amount={wallet.commission_balance}
                                            subtitle="Available"
                                            icon={<DollarSign className="h-5 w-5" />}
                                            gradient="from-green-500/10 to-transparent"
                                            borderColor="border-green-500/20 hover:border-green-500/40"
                                            iconColor="text-green-400"
                                        />
                                        <WalletCard
                                            title="Pending"
                                            amount={wallet.pending_commission}
                                            subtitle="Processing"
                                            icon={<TrendingUp className="h-5 w-5" />}
                                            gradient="from-amber-500/10 to-transparent"
                                            borderColor="border-amber-500/20 hover:border-amber-500/40"
                                            iconColor="text-amber-400"
                                        />
                                        <WalletCard
                                            title="Total Withdrawn"
                                            amount={wallet.total_withdrawn}
                                            subtitle="Lifetime"
                                            icon={<ArrowDownToLine className="h-5 w-5" />}
                                            gradient="from-blue-500/10 to-transparent"
                                            borderColor="border-blue-500/20 hover:border-blue-500/40"
                                            iconColor="text-blue-400"
                                        />
                                        <WalletCard
                                            title="Total Earned"
                                            amount={wallet.total_earned}
                                            subtitle="All time"
                                            icon={<CreditCard className="h-5 w-5" />}
                                            gradient="from-purple-500/10 to-transparent"
                                            borderColor="border-purple-500/20 hover:border-purple-500/40"
                                            iconColor="text-purple-400"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Wallet className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                        <p>Wallet data unavailable</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Editable Fields */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-card to-card/50 border border-border/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl"
                    >
                        <h3 className="text-xl font-bold mb-6">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="First Name"
                                value={firstName}
                                onChange={setFirstName}
                                disabled={!isEditing}
                                icon={<Edit2 className="h-4 w-4" />}
                            />
                            <InputField
                                label="Last Name"
                                value={lastName}
                                onChange={setLastName}
                                disabled={!isEditing}
                                icon={<Edit2 className="h-4 w-4" />}
                            />
                            <InputField
                                label="Telegram ID"
                                value={telegramId}
                                onChange={setTelegramId}
                                disabled={!isEditing}
                                icon={<MessageCircle className="h-4 w-4" />}
                                placeholder="@username"
                            />
                            <InputField
                                label="Phone Number"
                                value={phoneNumber}
                                onChange={setPhoneNumber}
                                disabled={!isEditing}
                                icon={<Phone className="h-4 w-4" />}
                                placeholder="+1234567890"
                            />
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex gap-3 justify-end mt-6 pt-6 border-t border-border"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCancel}
                                    disabled={updateProfile.isPending}
                                    className="px-6 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    disabled={updateProfile.isPending}
                                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updateProfile.isPending ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Logout Confirmation Modal */}
                {showLogoutConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowLogoutConfirm(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-red-500/10 rounded-full">
                                    <LogOut className="h-6 w-6 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Confirm Logout</h3>
                                    <p className="text-muted-foreground text-sm">Are you sure you want to log out?</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 px-4 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </ErrorBoundary>
    )
}

// UI Components
function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-card to-card/50 border border-border/50 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all"
        >
            <div className="flex items-center gap-3 mb-2">
                {icon}
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-base font-semibold truncate">{value}</p>
        </motion.div>
    )
}

interface WalletCardProps {
    title: string
    amount: number
    subtitle: string
    icon: React.ReactNode
    gradient: string
    borderColor: string
    iconColor: string
}

function WalletCard({ title, amount, subtitle, icon, gradient, borderColor, iconColor }: WalletCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className={`bg-gradient-to-br ${gradient} border ${borderColor} rounded-xl p-5 transition-all group shadow-lg hover:shadow-xl`}
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-medium">{title}</span>
                <div className={`${iconColor} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
            <p className="text-2xl font-bold mb-1">
                ${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className={`text-xs ${iconColor} font-medium`}>{subtitle}</span>
        </motion.div>
    )
}

function InputField({
    label,
    value,
    onChange,
    disabled,
    icon,
    placeholder
}: {
    label: string
    value: string
    onChange: (value: string) => void
    disabled: boolean
    icon: React.ReactNode
    placeholder?: string
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {icon}
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50
                        ${disabled ? 'cursor-not-allowed opacity-60' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}
                        transition-all outline-none`}
                />
            </div>
        </div>
    )
}
