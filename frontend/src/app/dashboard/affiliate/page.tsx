"use client"
import { MousePointer2, UserPlus, DollarSign, Copy, Link as LinkIcon, TrendingUp, Wallet, Zap } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import dynamic from 'next/dynamic'
import { useAffiliateStats, useCreateLink, useSeedCampaignData } from "@/hooks/useAffiliateDashboard"
import { useState } from "react"
import toast from "react-hot-toast"

const UserGlobe = dynamic(() => import('@/components/dashboard/UserGlobe').then(mod => mod.UserGlobe), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs animate-pulse">Loading Live Traffic...</div>
})

const AffiliatePerformanceChart = dynamic(() => import('@/components/dashboard/charts/AffiliatePerformanceChart'), {
    ssr: false,
    loading: () => <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground text-xs animate-pulse bg-muted/20 rounded-xl">Loading Chart...</div>
})

export default function AffiliateDashboard() {
    const { data: stats, isLoading } = useAffiliateStats()
    const createLink = useCreateLink()
    const seedCampaignData = useSeedCampaignData()
    const [targetUrl, setTargetUrl] = useState("https://nexusplay.com/casino")
    const [campaignName, setCampaignName] = useState("")
    const [generatedLink, setGeneratedLink] = useState("")

    const handleGenerateLink = async () => {
        if (!campaignName.trim()) {
            toast.error("Please enter a campaign name")
            return
        }

        try {
            const result = await createLink.mutateAsync({
                target_url: targetUrl,
                campaign_name: campaignName
            })
            setGeneratedLink(result.short_link)
            toast.success("Link generated!")
        } catch (error) {
            // Error handled by mutation
        }
    }

    const handleCopyLink = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink)
            toast.success("Link copied to clipboard!")
        }
    }

    const handleSeedCampaign = () => {
        seedCampaignData.mutate({ days: 7 })
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Affiliate Dashboard</h1>
                    <p className="text-muted-foreground">Track your campaigns and manage your referral assets.</p>
                </div>
                <Button
                    variant="outline"
                    className="gap-2 border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                    onClick={handleSeedCampaign}
                    disabled={seedCampaignData.isPending}
                >
                    <Zap className="h-4 w-4" />
                    {seedCampaignData.isPending ? "Seeding..." : "Seed Campaign Data"}
                </Button>
            </div>

            {/* Stats Grid - 4K Optimized */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Clicks"
                    value={isLoading ? "..." : stats?.total_clicks.toLocaleString() || "0"}
                    change={stats?.conversion_rate ? `${stats.conversion_rate.toFixed(1)}% conversion` : "Loading..."}
                    icon={<MousePointer2 className="h-4 w-4 text-blue-400" />}
                    isLoading={isLoading}
                />
                <StatsCard
                    title="Registrations"
                    value={isLoading ? "..." : stats?.registrations.toLocaleString() || "0"}
                    change={stats && stats.total_clicks > 0 ? `${((stats.registrations / stats.total_clicks) * 100).toFixed(1)}% Click-to-Reg` : "Loading..."}
                    icon={<UserPlus className="h-4 w-4 text-violet-400" />}
                    isLoading={isLoading}
                />
                <StatsCard
                    title="First Deposits (FTD)"
                    value={isLoading ? "..." : stats?.ftd_count.toLocaleString() || "0"}
                    change={stats && stats.registrations > 0 ? `${((stats.ftd_count / stats.registrations) * 100).toFixed(1)}% Reg-to-Dep` : "Loading..."}
                    icon={<TrendingUp className="h-4 w-4 text-green-400" />}
                    isLoading={isLoading}
                />
                <StatsCard
                    title="Total Revenue"
                    value={isLoading ? "..." : `$${parseFloat(stats?.total_revenue || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    change={stats?.pending_payouts ? `$${stats.pending_payouts} pending` : "Loading..."}
                    icon={<Wallet className="h-4 w-4 text-amber-400" />}
                    isLoading={isLoading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                {/* Conversion Chart */}
                <div className="lg:col-span-2 2xl:col-span-3 glass-panel rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Campaign Performance</h3>
                    <AffiliatePerformanceChart />
                </div>

                {/* Right Column: Globe & Quick Link */}
                <div className="space-y-6">
                    {/* Live Traffic Globe */}
                    <div className="glass-panel rounded-2xl relative overflow-hidden flex flex-col h-[300px]">
                        <div className="p-4 pb-0 z-10 flex justify-between items-center">
                            <div>
                                <h3 className="text-md font-semibold text-foreground">Live Traffic</h3>
                                <p className="text-xs text-muted-foreground">Real-time clicks</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-mono text-green-500 font-bold">ONLINE</span>
                            </div>
                        </div>
                        <div className="flex-1 w-full relative">
                            <div className="absolute inset-0 scale-[1.5] translate-y-10">
                                <UserGlobe />
                            </div>
                        </div>
                    </div>

                    {/* Quick Link Generator */}
                    <div className="glass-panel rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <LinkIcon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Quick Link</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Target URL</label>
                                <Input
                                    value={targetUrl}
                                    onChange={(e) => setTargetUrl(e.target.value)}
                                    placeholder="https://nexusplay.com/casino"
                                    className="bg-muted/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Campaign Name</label>
                                <Input
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    placeholder="summer_promo"
                                    className="bg-muted/30"
                                />
                            </div>
                            {generatedLink && (
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-green-400 uppercase">Generated Link</label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={generatedLink}
                                            readOnly
                                            className="bg-muted/30 text-green-500 font-mono text-xs"
                                        />
                                        <Button variant="outline" size="sm" onClick={handleCopyLink}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Button
                            variant="glow"
                            className="w-full"
                            onClick={handleGenerateLink}
                            disabled={createLink.isPending}
                        >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            {createLink.isPending ? "Generating..." : "Generate Link"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, change, icon, isLoading }: { title: string, value: string, change: string, icon: React.ReactNode, isLoading?: boolean }) {
    return (
        <Card className="p-6 glass-panel hover:border-primary/20 transition-all group">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {title}
                </h3>
                {icon}
            </div>
            <div className="pt-2">
                <div className={`text-2xl font-bold text-foreground ${isLoading ? 'animate-pulse' : ''}`}>{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{change}</p>
            </div>
        </Card>
    )
}
