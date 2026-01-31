"use client"
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

export default function AffiliatePerformanceChart() {
    return (
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
    )
}
