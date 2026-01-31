"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserService, UpdateProfilePayload } from '@/services/user.service'
import { User } from '@/services/auth.service'
import { toast } from 'sonner'
import { Edit2, Save, X, Wallet, Calendar, Mail, Phone, MessageCircle, Shield, CreditCard, LogOut } from 'lucide-react'
import { AuthService } from '@/services/auth.service'

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    // Form state
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [telegramId, setTelegramId] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            setIsLoading(true)
            const data = await UserService.getProfile()
            setUser(data)
            // Set form values
            setFirstName(data.first_name || '')
            setLastName(data.last_name || '')
            setTelegramId(data.telegram_id || '')
            setPhoneNumber(data.phone_number || '')
        } catch (error) {
            toast.error('Failed to load profile')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            const payload: UpdateProfilePayload = {
                first_name: firstName,
                last_name: lastName,
                telegram_id: telegramId,
                phone_number: phoneNumber
            }
            const updated = await UserService.updateProfile(payload)
            setUser(updated)
            setIsEditing(false)
            toast.success('Profile updated successfully!')
        } catch (error) {
            toast.error('Failed to update profile')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        // Reset form to current user data
        if (user) {
            setFirstName(user.first_name || '')
            setLastName(user.last_name || '')
            setTelegramId(user.telegram_id || '')
            setPhoneNumber(user.phone_number || '')
        }
        setIsEditing(false)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-muted-foreground">Unable to load profile</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">My Profile</h1>
                        <p className="text-muted-foreground mt-1">Manage your account information</p>
                    </div>
                    <div className="flex gap-3">
                        {!isEditing && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                            >
                                <Edit2 className="h-4 w-4" />
                                Edit Profile
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-semibold hover:bg-red-500/20 transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </motion.button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative space-y-6">
                            {/* Avatar Section */}
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/25">
                                    {user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-foreground">
                                        {user.full_name || `${user.first_name} ${user.last_name}`}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'AGENT' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                        {user.is_active && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Info Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                                <InfoField
                                    icon={<Mail className="h-5 w-5" />}
                                    label="Email"
                                    value={user.email}
                                />

                                <InfoField
                                    icon={<Calendar className="h-5 w-5" />}
                                    label="Member Since"
                                    value={new Date(user.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                />

                                <EditableField
                                    icon={<Shield className="h-5 w-5" />}
                                    label="First Name"
                                    value={firstName}
                                    onChange={setFirstName}
                                    isEditing={isEditing}
                                />

                                <EditableField
                                    icon={<Shield className="h-5 w-5" />}
                                    label="Last Name"
                                    value={lastName}
                                    onChange={setLastName}
                                    isEditing={isEditing}
                                />

                                <EditableField
                                    icon={<MessageCircle className="h-5 w-5" />}
                                    label="Telegram ID"
                                    value={telegramId}
                                    onChange={setTelegramId}
                                    isEditing={isEditing}
                                    placeholder="@username"
                                />

                                <EditableField
                                    icon={<Phone className="h-5 w-5" />}
                                    label="Phone Number"
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                    isEditing={isEditing}
                                    placeholder="+1234567890"
                                />
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-4 pt-6 border-t border-white/10"
                                >
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="h-4 w-4" />
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-muted/50 text-foreground rounded-xl font-semibold hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Wallet Card */}
                    {user.wallet && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-primary to-primary/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-white"
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                            </div>

                            <div className="relative space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <Wallet className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm opacity-80">Balance</p>
                                            <p className="text-xs opacity-60">ID: {user.wallet.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                    {user.wallet.is_frozen && (
                                        <span className="px-3 py-1 bg-red-500/30 rounded-full text-xs font-semibold">
                                            Frozen
                                        </span>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <p className="text-5xl font-bold">
                                        {parseFloat(user.wallet.balance).toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                    <p className="text-sm opacity-80 mt-2">{user.wallet.currency}</p>
                                </div>

                                <div className="pt-6 border-t border-white/20 space-y-3">
                                    <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all">
                                        <CreditCard className="h-4 w-4" />
                                        Deposit
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/20 transition-all">
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-500/10 rounded-xl">
                                <LogOut className="h-6 w-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Confirm Logout</h3>
                                <p className="text-sm text-muted-foreground">Are you sure you want to sign out?</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 px-6 py-3 bg-muted/50 text-foreground rounded-xl font-semibold hover:bg-muted transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => AuthService.logout()}
                                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

// Helper Components
function InfoField({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-white/5">
            <div className="text-primary">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="text-sm font-semibold text-foreground truncate">{value}</p>
            </div>
        </div>
    )
}

function EditableField({
    icon,
    label,
    value,
    onChange,
    isEditing,
    placeholder
}: {
    icon: React.ReactNode
    label: string
    value: string
    onChange: (val: string) => void
    isEditing: boolean
    placeholder?: string
}) {
    if (!isEditing) {
        return <InfoField icon={icon} label={label} value={value || '—'} />
    }

    return (
        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="text-primary mt-2">
                {icon}
            </div>
            <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-2 block">{label}</label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>
        </div>
    )
}
