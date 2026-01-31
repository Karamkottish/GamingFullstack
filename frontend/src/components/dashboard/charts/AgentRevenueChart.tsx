import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { RevenueChartPoint } from '@/services/agent.service'

interface AgentRevenueChartProps {
    data?: RevenueChartPoint[]
    isLoading?: boolean
}

export default function AgentRevenueChart({ data = [], isLoading = false }: AgentRevenueChartProps) {
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
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <RechartsTooltip
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
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
