"use client"
import { Wallet, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"

// Dummy Payout Data
const PAYOUTS = [
    { id: "PO-9912", date: "2024-03-28", method: "USDT (TRC20)", amount: 1540.00, status: "COMPLETED" },
    { id: "PO-8821", date: "2024-03-15", method: "Bitcoin", amount: 2300.50, status: "COMPLETED" },
    { id: "PO-7732", date: "2024-02-28", method: "Bank Wire", amount: 500.00, status: "REJECTED" },
    { id: "PO-6612", date: "2024-04-01", method: "USDT (TRC20)", amount: 1200.00, status: "PENDING" },
]

export default function AffiliatePayoutsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Payouts</h1>
                    <p className="text-muted-foreground">Manage your earnings and withdrawal requests.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Withdrawal Form */}
                <div className="lg:col-span-1">
                    <Card className="p-6 bg-gradient-to-br from-primary/10 to-violet-900/10 border-primary/20">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-primary" />
                            Request Withdrawal
                        </h3>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
                                <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                                <h2 className="text-3xl font-bold text-white">$4,230.50</h2>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Amount</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="0.00" className="pl-9 bg-black/20" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Payment Method</label>
                                <select className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50">
                                    <option>USDT (TRC20)</option>
                                    <option>Bitcoin</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Wallet Address</label>
                                <Input placeholder="T..." className="bg-black/20" />
                            </div>

                            <Button className="w-full mt-2" variant="glow">
                                Submit Request
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* History Table */}
                <div className="lg:col-span-2">
                    <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6 h-full">
                        <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-muted-foreground uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">ID</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Method</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right rounded-r-lg">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {PAYOUTS.map((txn) => (
                                        <tr key={txn.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-4 font-mono text-xs text-white/70">{txn.id}</td>
                                            <td className="px-4 py-4 text-white">{txn.date}</td>
                                            <td className="px-4 py-4 text-muted-foreground">{txn.method}</td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold ${txn.status === 'COMPLETED' ? 'text-green-400 bg-green-400/10' :
                                                        txn.status === 'PENDING' ? 'text-amber-400 bg-amber-400/10' :
                                                            'text-red-400 bg-red-400/10'
                                                    }`}>
                                                    {txn.status === 'COMPLETED' && <CheckCircle className="h-3 w-3" />}
                                                    {txn.status === 'PENDING' && <Clock className="h-3 w-3" />}
                                                    {txn.status === 'REJECTED' && <XCircle className="h-3 w-3" />}
                                                    {txn.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right font-medium text-white">
                                                ${txn.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
