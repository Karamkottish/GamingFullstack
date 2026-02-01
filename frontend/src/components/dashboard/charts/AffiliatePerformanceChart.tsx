"use client"
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useAffiliatePerformance } from '@/hooks/useAffiliateDashboard'

export default function AffiliatePerformanceChart() {
    const { data: performanceData, isLoading } = useAffiliatePerformance(7)

    // Transform API data to chart format
    const chartData = performanceData?.map(point => ({
        name: new Date(point.date).toLocaleDateString('en-US', { weekday: 'short' }),
        clicks: point.clicks,
        conversions: point.conversions,
        revenue: parseFloat(point.revenue)
    })) || []

    if (isLoading) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center">
                <div className="text-muted-foreground text-sm animate-pulse">Loading performance data...</div>
            </div>
        )
    }

    if (chartData.length === 0) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center">
                <div className="text-muted-foreground text-sm">No performance data yet. Click "Seed Campaign Data" to generate demo data.</div>
            </div>
        )
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
