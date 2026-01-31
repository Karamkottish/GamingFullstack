"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MoreVertical, Ban, CheckCircle, Plus, UserPlus, RefreshCcw, AlertCircle, Mail, Shield, User, Key, MessageCircle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { Modal } from "@/components/ui/Modal"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Skeleton } from "@/components/ui/Skeleton"
import { useAgentUsers, useAddAgentUser, useToggleUserStatus } from "@/hooks/useAgentUsers"
import toast from "react-hot-toast"

function TableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
                <Skeleton width="300px" height="40px" />
                <Skeleton width="120px" height="40px" />
            </div>
            <div className="border border-white/5 rounded-xl overflow-hidden">
                <div className="bg-white/5 h-12 px-4 flex items-center gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} width={i === 0 ? "200px" : "100px"} height="12px" />
                    ))}
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 px-4 flex items-center gap-4 border-t border-white/5">
                        <Skeleton variant="circular" width="32px" height="32px" />
                        <div className="space-y-2 flex-1">
                            <Skeleton width="150px" height="12px" />
                            <Skeleton width="100px" height="10px" />
                        </div>
                        <Skeleton width="100px" height="12px" />
                        <Skeleton width="120px" height="12px" />
                        <Skeleton width="80px" height="12px" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function UserRowSkeleton() {
    return (
        <tr className="border-t border-white/5">
            <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                    <Skeleton variant="circular" width="32px" height="32px" />
                    <div className="space-y-2">
                        <Skeleton width="120px" height="12px" />
                        <Skeleton width="80px" height="10px" />
                    </div>
                </div>
            </td>
            <td className="px-4 py-4"><Skeleton width="80px" height="20px" /></td>
            <td className="px-4 py-4"><Skeleton width="100px" height="12px" /></td>
            <td className="px-4 py-4"><Skeleton width="100px" height="12px" /></td>
            <td className="px-4 py-4 flex justify-end"><Skeleton width="32px" height="32px" /></td>
        </tr>
    )
}

export default function AgentUsersPage() {
    const [page, setPage] = useState(1)
    const [pageSize] = useState(20)
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        telegram_id: ""
    })

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300)
        return () => clearTimeout(timer)
    }, [search])

    const { data: usersResponse, isLoading, error, refetch } = useAgentUsers(page, pageSize, debouncedSearch)
    const addUserMutation = useAddAgentUser()
    const toggleStatusMutation = useToggleUserStatus()

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault()
        addUserMutation.mutate(formData, {
            onSuccess: () => {
                setIsAddUserOpen(false)
                setFormData({ email: "", password: "", first_name: "", last_name: "", telegram_id: "" })
            }
        })
    }

    const filteredUsers = useMemo(() => {
        if (!usersResponse?.data) return []
        if (statusFilter === "ALL") return usersResponse.data
        return usersResponse.data.filter(u => u.status === statusFilter)
    }, [usersResponse, statusFilter])

    const totalPages = Math.ceil((usersResponse?.total || 0) / pageSize)

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 bg-red-500/5 rounded-2xl border border-red-500/10 p-8">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h3 className="text-xl font-bold">Failed to load users</h3>
                <p className="text-muted-foreground text-sm max-w-xs">{error instanceof Error ? error.message : "An unexpected error occurred."}</p>
                <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4" /> Retry
                </Button>
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">User Management</h1>
                        <p className="text-muted-foreground">Manage players registered under your agency.</p>
                    </div>
                    <Button variant="glow" onClick={() => setIsAddUserOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-5 w-5" /> Add New User
                    </Button>
                </div>

                <Card className="bg-black/30 border-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search users by ID, Email or Username..."
                                    className="pl-9 bg-black/20 focus:bg-black/40 transition-all border-white/10"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-all min-w-[140px]"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="BLOCKED">Blocked</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4">Total Deposited</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 relative">
                                <AnimatePresence mode="popLayout">
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map((_, i) => <UserRowSkeleton key={`skl-${i}`} />)
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2 opacity-30">
                                                    <User className="h-10 w-10" />
                                                    <p>No users found matching your criteria.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <motion.tr
                                                key={user.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="group hover:bg-white/[0.03] transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-primary uppercase">
                                                            {user.full_name?.slice(0, 2) || "PL"}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-white text-sm">{user.full_name}</p>
                                                            <p className="text-xs text-muted-foreground/60">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${user.status === 'ACTIVE'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                        }`}>
                                                        {user.status === 'ACTIVE' ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-white text-xs">{new Date(user.joined_at).toLocaleDateString()}</p>
                                                    <p className="text-[10px] text-muted-foreground/40 mt-0.5">{user.last_active || 'Just now'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-white font-mono text-sm">${user.total_deposited.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                                    <p className="text-[10px] text-muted-foreground/40">Total Wagered: ${user.total_wagered.toLocaleString()}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            disabled={toggleStatusMutation.isPending}
                                                            onClick={() => toggleStatusMutation.mutate(user.id)}
                                                            className={`h-8 w-8 rounded-lg transition-all ${user.status === 'ACTIVE'
                                                                ? 'hover:bg-rose-500/20 hover:text-rose-400 border-rose-500/10'
                                                                : 'hover:bg-emerald-500/20 hover:text-emerald-400 border-emerald-500/10'}`}
                                                        >
                                                            {user.status === 'ACTIVE' ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                                        </Button>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 border-white/5 hover:bg-white/5">
                                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-white/5 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-muted-foreground">Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, usersResponse?.total || 0)} of {usersResponse?.total || 0} users</p>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1 || isLoading}
                                onClick={() => setPage(p => p - 1)}
                                className="h-9 gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" /> Previous
                            </Button>
                            <span className="text-xs font-bold text-white px-2">Page {page} of {totalPages || 1}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages || isLoading}
                                onClick={() => setPage(p => p + 1)}
                                className="h-9 gap-1"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Add User Modal */}
                <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title="Register New Player">
                    <div className="space-y-6">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Manually register a new user under your agency. An activation email will be sent to the user.
                        </p>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <User className="h-3 w-3" /> First Name
                                    </label>
                                    <Input
                                        placeholder="Karam"
                                        required
                                        value={formData.first_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                                        className="bg-black/40 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <User className="h-3 w-3" /> Last Name
                                    </label>
                                    <Input
                                        placeholder="Kottish"
                                        required
                                        value={formData.last_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                                        className="bg-black/40 border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <Mail className="h-3 w-3" /> Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="player@nexusplay.io"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="bg-black/40 border-white/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <Key className="h-3 w-3" /> Default Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="bg-black/40 border-white/10"
                                />
                                <p className="text-[10px] text-muted-foreground/60 italic">User will be prompted to change this on first login.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <MessageCircle className="h-3 w-3" /> Telegram ID
                                </label>
                                <Input
                                    placeholder="@nexus_player"
                                    value={formData.telegram_id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, telegram_id: e.target.value }))}
                                    className="bg-black/40 border-white/10"
                                />
                            </div>

                            <div className="pt-6 flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsAddUserOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="glow"
                                    className="flex-1 h-11"
                                    isLoading={addUserMutation.isPending}
                                >
                                    Register <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </ErrorBoundary>
    )
}
