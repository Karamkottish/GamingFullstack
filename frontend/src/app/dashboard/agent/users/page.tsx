"use client"
import { Search, MoreVertical, Ban, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"

// Dummy Data for Backend Reference
const USERS_DATA = [
    { id: 1, username: "player_one", email: "player1@gmail.com", status: "ACTIVE", joined: "2024-01-15", totalDeposited: 1250.00, lastActive: "2 mins ago" },
    { id: 2, username: "vip_gambler", email: "vip@proton.me", status: "ACTIVE", joined: "2024-02-01", totalDeposited: 15420.50, lastActive: "1 hour ago" },
    { id: 3, username: "suspicious_acc", email: "temp123@mail.com", status: "BLOCKED", joined: "2024-03-10", totalDeposited: 0.00, lastActive: "5 days ago" },
    { id: 4, username: "new_whale", email: "whale@crypto.com", status: "ACTIVE", joined: "2024-03-12", totalDeposited: 5000.00, lastActive: "Just now" },
    { id: 5, username: "casual_play", email: "casual@test.com", status: "ACTIVE", joined: "2024-01-20", totalDeposited: 150.00, lastActive: "2 days ago" },
]

export default function AgentUsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
                    <p className="text-muted-foreground">Manage players registered under your agency.</p>
                </div>
                <Button variant="glow">
                    + Add New User
                </Button>
            </div>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
                {/* Filters */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search users by ID, Email or Username..." className="pl-9 bg-black/20" />
                    </div>
                    <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Blocked</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-muted-foreground uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">User</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Joined</th>
                                <th className="px-4 py-3 text-right">Total Deposited</th>
                                <th className="px-4 py-3 text-right rounded-r-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {USERS_DATA.map((user) => (
                                <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                                                {user.username.slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{user.username}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE'
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            {user.status === 'ACTIVE' ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-muted-foreground">
                                        {user.joined}
                                        <span className="block text-xs opacity-50">{user.lastActive}</span>
                                    </td>
                                    <td className="px-4 py-4 text-right font-medium text-white">
                                        ${user.totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Dummy) */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                    <p className="text-xs text-muted-foreground">Showing 1-5 of 128 users</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
