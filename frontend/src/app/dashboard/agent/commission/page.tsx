"use client"
import { useState } from "react"
import { Download, Calendar, DollarSign, Filter } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { toast } from "sonner"

// Dummy Commission Data
const COMMISSION_HISTORY = [
    { id: "TX-9981", date: "2024-03-25", period: "Week 12", amount: 450.00, type: "Revenue Share (30%)", status: "PAID" },
    { id: "TX-9231", date: "2024-03-18", period: "Week 11", amount: 380.50, type: "Revenue Share (30%)", status: "PAID" },
    { id: "TX-8821", date: "2024-03-11", period: "Week 10", amount: 920.00, type: "Revenue Share (30%)", status: "PAID" },
    { id: "TX-7742", date: "2024-03-04", period: "Week 09", amount: 120.00, type: "Revenue Share (30%)", status: "PAID" },
    { id: "TX-PEND", date: "2024-04-01", period: "Week 13", amount: 560.00, type: "Revenue Share (30%)", status: "PENDING" },
]

export default function AgentCommissionPage() {
    const [isPayoutOpen, setIsPayoutOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleRequestPayout = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setIsPayoutOpen(false)
            toast.success("Payout request submitted!")
        }, 1500)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Commission History</h1>
                    <p className="text-muted-foreground">Track your weekly settlements and payouts.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Date Range
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Payout Modal */}
            <Modal isOpen={isPayoutOpen} onClose={() => setIsPayoutOpen(false)} title="Request Payout">
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Available to Withdraw</p>
                        <h2 className="text-3xl font-bold text-green-400">$2,430.50</h2>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Amount</label>
                        <Input defaultValue="2430.50" className="bg-black/20" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Method</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50">
                            <option>USDT (TRC20)</option>
                            <option>Bank Transfer</option>
                        </select>
                    </div>
                    <Button variant="glow" onClick={handleRequestPayout} isLoading={isLoading} className="w-full">
                        Confirm Request
                    </Button>
                </div>
            </Modal>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-600/5 border-green-500/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-green-400">Available to Withdraw</p>
                            <h3 className="text-3xl font-bold text-white mt-2">$2,430.50</h3>
                        </div>
                        <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                            <DollarSign className="h-6 w-6" />
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsPayoutOpen(true)}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-900/20"
                    >
                        Request Payout
                    </Button>
                </Card>

                <Card className="p-6 bg-black/40 border-white/10">
                    <p className="text-sm font-medium text-muted-foreground">Total Earned (All Time)</p>
                    <h3 className="text-3xl font-bold text-white mt-2">$45,231.89</h3>
                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        Lifetime Revenue Share
                    </p>
                </Card>

                <Card className="p-6 bg-black/40 border-white/10">
                    <p className="text-sm font-medium text-muted-foreground">Current Rate</p>
                    <h3 className="text-3xl font-bold text-white mt-2">30%</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Agent Tier: <span className="text-violet-400 font-semibold">Gold</span>
                    </p>
                </Card>
            </div>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Payout History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-muted-foreground uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Transaction ID</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Period</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right rounded-r-lg">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {COMMISSION_HISTORY.map((txn) => (
                                <tr key={txn.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4 font-mono text-xs text-white/70">{txn.id}</td>
                                    <td className="px-4 py-4 text-white">{txn.date}</td>
                                    <td className="px-4 py-4 text-muted-foreground">{txn.period}</td>
                                    <td className="px-4 py-4 text-white">{txn.type}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${txn.status === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-500'
                                            }`}>
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
    )
}
