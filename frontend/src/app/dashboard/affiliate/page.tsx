"use client"
import { MousePointer2, UserPlus, DollarSign, Copy, Download, Link as LinkIcon, Image } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const data = [
    { name: 'Mon', clicks: 120, conversions: 10 },
    { name: 'Tue', clicks: 150, conversions: 22 },
    { name: 'Wed', clicks: 200, conversions: 35 },
    { name: 'Thu', clicks: 180, conversions: 30 },
    { name: 'Fri', clicks: 250, conversions: 45 },
    { name: 'Sat', clicks: 300, conversions: 60 },
    { name: 'Sun', clicks: 350, conversions: 75 },
]

export default function AffiliateDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Affiliate Dashboard</h1>
                <p className="text-muted-foreground">Track your campaigns and manage your referral assets.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Clicks"
                    value="12,543"
                    change="+24% this week"
                    icon={<MousePointer2 className="h-4 w-4 text-blue-400" />}
                />
                <StatsCard
                    title="Registrations"
                    value="892"
                    change="7.1% Conversion Rate"
                    icon={<UserPlus className="h-4 w-4 text-violet-400" />}
                />
                <StatsCard
                    title="First Deposits (FTD)"
                    value="345"
                    change="38% Reg-to-Dep"
                    icon={<DollarSign className="h-4 w-4 text-green-400" />}
                />
                <StatsCard
                    title="Total Revenue"
                    value="$15,234.00"
                    change="+12% from last month"
                    icon={<DollarSign className="h-4 w-4 text-amber-400" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Conversion Chart */}
                <div className="lg:col-span-2 bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-6">Campaign Performance</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="clicks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorClicks)" />
                                <Area type="monotone" dataKey="conversions" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorConv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Link Generator */}
                <div className="space-y-6">
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <LinkIcon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Quick Link Generator</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Create a tracking link for your next campaign.</p>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Target Page</label>
                            <Input placeholder="https://nexusplay.com/casino" className="bg-black/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Campaign ID (Optional)</label>
                            <Input placeholder="summer-promo-2027" className="bg-black/20" />
                        </div>
                        <Button variant="glow" className="w-full">
                            <Copy className="h-4 w-4 mr-2" />
                            Generate & Copy Link
                        </Button>
                    </div>

                    {/* Marketing Assets Mini */}
                    <div className="bg-gradient-to-br from-violet-900/20 to-primary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Image className="h-24 w-24" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Marketing Assets</h3>
                        <p className="text-sm text-muted-foreground mb-4 relative z-10">Access high-quality banners, logos, and landing page templates.</p>
                        <Button variant="outline" size="sm" className="relative z-10 bg-black/50 hover:bg-black/70 border-primary/30">
                            View Library
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
    return (
        <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm hover:border-primary/20 transition-all group">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">
                    {title}
                </h3>
                {icon}
            </div>
            <div className="pt-2">
                <div className="text-2xl font-bold text-white">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{change}</p>
            </div>
        </Card>
    )
}
