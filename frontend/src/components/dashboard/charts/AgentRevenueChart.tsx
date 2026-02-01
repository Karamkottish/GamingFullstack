"use client"
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { RevenueChartPoint } from '@/services/agent.service'
import { useTheme } from '@/contexts/ThemeContext'

interface AgentRevenueChartProps {
    data?: RevenueChartPoint[]
    isLoading?: boolean
}

export default function AgentRevenueChart({ data = [], isLoading = false }: AgentRevenueChartProps) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div className="h-[300px] w-full">
            {isLoading ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm animate-pulse">
                    Loading revenue data...
                </div>
            ) : data.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    No revenue data available
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            stroke={isDark ? "#888888" : "#444444"}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke={isDark ? "#888888" : "#444444"}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                borderRadius: '8px',
                                color: isDark ? '#ffffff' : '#000000'
                            }}
                            itemStyle={{ color: isDark ? '#ffffff' : '#000000' }}
                            cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                        />
                        <Bar
                            dataKey="revenue"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}
