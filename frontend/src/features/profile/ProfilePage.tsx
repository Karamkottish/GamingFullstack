import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useWallet } from '@/hooks/useWallet'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Skeleton } from '@/components/ui/Skeleton'
import {
    Edit2, Save, X, Wallet, Calendar, Mail, Phone, MessageCircle,
    Shield, CreditCard, LogOut, TrendingUp, DollarSign,
    ArrowDownToLine, AlertCircle, Key, Lock, Eye, EyeOff, CheckCircle2
} from 'lucide-react'
import { AuthService } from '@/services/auth.service'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

// ... (ProfileSkeleton and ProfileError remain largely similar, but can be polished)

function ProfileSkeleton() {
    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6 animate-pulse">
            <div className="bg-card/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <Skeleton variant="circular" width="120px" height="120px" />
                    <div className="space-y-3 flex-1">
                        <Skeleton width="250px" height="36px" />
                        <Skeleton width="180px" height="20px" />
                        <div className="flex gap-2 pt-2">
                            <Skeleton width="80px" height="24px" className="rounded-full" />
                            <Skeleton width="80px" height="24px" className="rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-card/30 border border-white/5 rounded-2xl p-6">
                        <Skeleton width="40px" height="40px" className="rounded-xl mb-4" />
                        <Skeleton width="80px" height="12px" className="mb-2" />
                        <Skeleton width="120px" height="20px" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function ProfileError({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md text-center bg-card/50 border border-white/10 p-10 rounded-3xl backdrop-blur-2xl shadow-2xl"
            >
                <div className="mb-6 flex justify-center">
                    <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>
                </div>
                <h2 className="text-2xl font-black mb-3 text-white">System Error</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                    We're having trouble retrieving your profile data from the blockchain network.
                </p>
                <Button
                    onClick={onRetry}
                    variant="glow"
                    className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs"
                >
                    Retry Connection
                </Button>
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

    // Password state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    // Initialize form when user data loads
    useMemo(() => {
        if (user) {
            setFirstName(user.first_name || '')
            setLastName(user.last_name || '')
            setTelegramId(user.telegram_id || '')
            setPhoneNumber(user.phone_number || '')
        }
    }, [user])

    const handleEdit = () => {
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
                    toast.success('Identity profile updated successfully')
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
        toast.info('Closing session...')
        setTimeout(() => {
            AuthService.logout()
        }, 800)
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            toast.error("Security verification failed: Passwords mismatch")
            return
        }
        if (newPassword.length < 8) {
            toast.error("Constraint error: Password must be at least 8 characters")
            return
        }

        setIsChangingPassword(true)
        try {
            await AuthService.changePassword(currentPassword, newPassword)
            toast.success("Security credentials updated successfully", {
                icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
            })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Authorization error: Failed to update password")
        } finally {
            setIsChangingPassword(false)
        }
    }

    // Passwords match validation
    const passwordsMatch = newPassword === confirmPassword && newPassword !== ""

    if (isLoading) return <ProfileSkeleton />
    if (error || !user) return <ProfileError onRetry={() => refetch()} />

    return (
        <ErrorBoundary>
            <div className="space-y-10 pb-20">
                {/* Stunning Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group h-full"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-[2.5rem] blur-2xl group-hover:opacity-100 opacity-60 transition-opacity duration-700" />
                    <div className="relative bg-black/40 border border-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">
                        {/* Abstract background shape */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 relative z-10">
                            {/* Avatar with Glow */}
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary via-primary/80 to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] ring-4 ring-white/10"
                                >
                                    {user.first_name?.[0]}{user.last_name?.[0]}
                                </motion.div>
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-10 h-10 rounded-full border-[6px] border-black flex items-center justify-center shadow-lg">
                                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                                        {user.first_name} <span className="text-white/60">{user.last_name}</span>
                                    </h2>
                                    <div className="flex flex-wrap gap-3 items-center">
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                                            <Mail className="h-3.5 w-3.5 text-primary" />
                                            <span className="text-xs font-bold text-white/80">{user.email}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border font-black text-[10px] uppercase tracking-widest
                                            ${user.role === 'AGENT' ? 'bg-primary/20 border-primary/30 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]' :
                                                'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'}`}>
                                            <Shield className="h-3 w-3" />
                                            {user.role} Partner
                                        </div>
                                    </div>
                                </div>
                                <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                                    Manage your global gaming network credentials. Update your identity records and maintain security standards from this centralized hub.
                                </p>
                            </div>

                            {/* External Actions */}
                            <div className="flex md:flex-col gap-3 w-full md:w-auto">
                                {!isEditing ? (
                                    <Button variant="glow" onClick={handleEdit} className="flex-1 md:w-48 h-12 text-xs font-bold uppercase tracking-widest rounded-2xl">
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Modify Profile
                                    </Button>
                                ) : (
                                    <Button variant="outline" onClick={handleCancel} className="flex-1 md:w-48 h-12 text-xs font-bold uppercase tracking-widest rounded-2xl bg-white/5">
                                        <X className="h-4 w-4 mr-2" />
                                        Discard
                                    </Button>
                                )}
                                <Button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="flex-1 md:w-48 h-12 text-xs font-bold uppercase tracking-widest rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Exit System
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Personal Data */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        {/* Profile Details Card */}
                        <div className="bg-black/40 border border-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-white">Identity Details</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Personal Verification Records</p>
                                </div>
                                {isEditing && (
                                    <div className="flex items-center gap-1 text-[10px] font-black text-primary animate-pulse tracking-widest uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        LIVE EDITING
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <PremiumInput
                                    label="First Name"
                                    value={firstName}
                                    onChange={setFirstName}
                                    disabled={!isEditing}
                                    icon={<Edit2 className="h-4 w-4" />}
                                />
                                <PremiumInput
                                    label="Last Name"
                                    value={lastName}
                                    onChange={setLastName}
                                    disabled={!isEditing}
                                    icon={<Edit2 className="h-4 w-4" />}
                                />
                                <PremiumInput
                                    label="Telegram Alias"
                                    value={telegramId}
                                    onChange={setTelegramId}
                                    disabled={!isEditing}
                                    icon={<MessageCircle className="h-4 w-4" />}
                                    placeholder="@handle"
                                />
                                <PremiumInput
                                    label="Mobile Identity"
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                    disabled={!isEditing}
                                    icon={<Phone className="h-4 w-4" />}
                                    placeholder="+1..."
                                />
                            </div>

                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="pt-10 flex justify-end"
                                >
                                    <Button
                                        variant="glow"
                                        onClick={handleSave}
                                        isLoading={updateProfile.isPending}
                                        className="h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-[0.2em]"
                                    >
                                        <Save className="h-4 w-4 mr-3" />
                                        Commit Changes
                                    </Button>
                                </motion.div>
                            )}
                        </div>

                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <GlassInfoCard
                                icon={<Calendar className="h-6 w-6 text-indigo-400" />}
                                label="Tenure"
                                sublabel="Joined Platform"
                                value={new Date(user.created_at).toISOString().split('T')[0]}
                                tag="VERIFIED"
                            />
                            <GlassInfoCard
                                icon={<Shield className="h-6 w-6 text-emerald-400" />}
                                label="Security Role"
                                sublabel="Access Level"
                                value={user.role}
                                tag="LEVEL 1"
                            />
                        </div>
                    </motion.div>

                    {/* Right Column: High Security Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-8"
                    >
                        <div className="bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 backdrop-blur-2xl rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-8 text-primary/10 select-none pointer-events-none">
                                <Key className="h-32 w-32 rotate-12" />
                            </div>

                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-primary/20 rounded-2xl shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
                                        <Lock className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">Security Vault</h3>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5">Change Passcode</p>
                                    </div>
                                </div>

                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <VaultInput
                                        label="Authorization Code"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={setCurrentPassword}
                                        disabled={isChangingPassword}
                                        placeholder="Current Password"
                                        toggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
                                        isShowing={showCurrentPassword}
                                    />
                                    <div className="h-px bg-white/5 my-2" />
                                    <VaultInput
                                        label="New Sequence"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={setNewPassword}
                                        disabled={isChangingPassword}
                                        placeholder="New Password"
                                        toggleShow={() => setShowNewPassword(!showNewPassword)}
                                        isShowing={showNewPassword}
                                    />
                                    <VaultInput
                                        label="Confirm Sequence"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={setConfirmPassword}
                                        disabled={isChangingPassword}
                                        placeholder="Repeat New Password"
                                    />

                                    {/* Security Strength Indicator */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                                            <span>Encryption Strength</span>
                                            <span>{newPassword.length > 0 ? (newPassword.length < 8 ? "WEAK" : "SECURE") : "EMPTY"}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                                            <motion.div
                                                className={`h-full rounded-full transition-all duration-500 ${newPassword.length > 0 ? (newPassword.length < 8 ? "bg-red-500 w-1/3" : "bg-primary w-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]") : "w-0"}`}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="glow"
                                        disabled={isChangingPassword || !newPassword || !passwordsMatch}
                                        isLoading={isChangingPassword}
                                        className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] mt-4"
                                    >
                                        Execute Update
                                    </Button>

                                    {confirmPassword && !passwordsMatch && (
                                        <p className="text-[10px] text-red-400 font-bold text-center mt-2 uppercase tracking-tight">Sequence mismatch detected</p>
                                    )}
                                </form>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                <p className="text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1.5">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                    End-to-end encrypted protocol active
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Logout Overlay */}
                <AnimatePresence>
                    {showLogoutConfirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                            onClick={() => setShowLogoutConfirm(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0" />
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl group shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                                        <LogOut className="h-10 w-10 text-red-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-white">System Exit</h3>
                                        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold opacity-60">Are you sure you want to terminate the current session?</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                        <Button
                                            onClick={() => setShowLogoutConfirm(false)}
                                            className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest border border-white/10"
                                        >
                                            Keep Session
                                        </Button>
                                        <Button
                                            onClick={handleLogout}
                                            className="h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20"
                                        >
                                            Sign Out
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ErrorBoundary>
    )
}

// Global Reusable UI Components for 2027 Aesthetic
function PremiumInput({ label, value, onChange, disabled, icon, placeholder }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    {icon}
                </div>
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full h-14 pl-12 pr-4 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {!disabled && <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />}
            </div>
        </div>
    )
}

function VaultInput({ label, type, value, onChange, disabled, placeholder, toggleShow, isShowing }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] font-black text-primary/60 uppercase tracking-[0.3em] ml-1">{label}</label>
            <div className="relative group">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full h-12 px-4 bg-black/40 border border-white/10 rounded-xl text-sm font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-primary/40 focus:bg-black/60 transition-all disabled:opacity-50"
                />
                {toggleShow && (
                    <button
                        type="button"
                        onClick={toggleShow}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                    >
                        {isShowing ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
        </div>
    )
}

function GlassInfoCard({ icon, label, sublabel, value, tag }: any) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-6 bg-white/5 border border-white/5 backdrop-blur-2xl rounded-[2rem] shadow-xl group overflow-hidden relative"
        >
            <div className="absolute -right-4 -bottom-4 text-white/[0.02] rotate-12 transition-transform group-hover:rotate-0 duration-700">
                {icon}
            </div>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/20 transition-all">
                    {icon}
                </div>
                <div className="text-[8px] font-black bg-white/5 px-2 py-0.5 rounded border border-white/10 tracking-widest text-white/40">
                    {tag}
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{label}</p>
                <p className="text-xl font-black text-white tracking-tight">{value}</p>
                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">{sublabel}</p>
            </div>
        </motion.div>
    )
}

// WalletCard remains similar but with updated styling
function WalletCard({ title, amount, subtitle, icon, gradient, borderColor, iconColor }: any) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-white/5 border border-white/5 rounded-2xl p-6 transition-all group overflow-hidden relative`}
        >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} blur-2xl opacity-40 pointer-events-none group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${iconColor}`}>
                    {icon}
                </div>
                <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Global</div>
            </div>
            <div className="relative z-10 space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</p>
                <p className="text-2xl font-black text-white">
                    ${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className={`text-[10px] font-black ${iconColor} opacity-70`}>{subtitle}</p>
            </div>
        </motion.div>
    )
}
