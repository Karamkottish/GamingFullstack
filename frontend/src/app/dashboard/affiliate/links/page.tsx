"use client"
import { Copy, Plus, Trash2, Link as LinkIcon, ExternalLink, TrendingUp, MousePointer2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { useAffiliateLinks, useCreateLink, useDeleteLink } from "@/hooks/useAffiliateDashboard"
import { useState } from "react"
import toast from "react-hot-toast"

export default function AffiliateLinksPage() {
    const { data: linksData, isLoading } = useAffiliateLinks(1, 20)
    const createLink = useCreateLink()
    const deleteLink = useDeleteLink()

    const [targetUrl, setTargetUrl] = useState("https://nexusplay.com/casino")
    const [campaignName, setCampaignName] = useState("")

    const handleGenerateLink = async () => {
        if (!campaignName.trim()) {
            toast.error("Please enter a campaign name")
            return
        }

        try {
            await createLink.mutateAsync({
                target_url: targetUrl,
                campaign_name: campaignName
            })
            setCampaignName("")
        } catch (error) {
            // Error handled by mutation
        }
    }

    const handleCopyLink = (slug: string) => {
        const fullLink = `https://nxs.gg/a/${slug}`
        navigator.clipboard.writeText(fullLink)
        toast.success("Link copied to clipboard!")
    }

    const handleDeleteLink = async (linkId: string) => {
        if (confirm("Are you sure you want to delete this link?")) {
            await deleteLink.mutateAsync(linkId)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Referral Links</h1>
                    <p className="text-muted-foreground">Create and manage your tracking links.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Link Generator */}
                <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm h-fit">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Generator</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Campaign Name</label>
                            <Input
                                placeholder="e.g. TikTok Profile"
                                className="bg-black/20"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Target URL</label>
                            <Input
                                placeholder="https://nexusplay.com/casino"
                                className="bg-black/20"
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-full"
                            variant="glow"
                            onClick={handleGenerateLink}
                            disabled={createLink.isPending}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {createLink.isPending ? "Generating..." : "Generate Link"}
                        </Button>
                    </div>
                </Card>

                {/* Active Links List */}
                <div className="lg:col-span-2">
                    <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Active Campaigns {linksData && `(${linksData.total})`}
                        </h3>

                        {isLoading ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <div className="animate-pulse">Loading links...</div>
                            </div>
                        ) : linksData && linksData.links.length > 0 ? (
                            <div className="space-y-4">
                                {linksData.links.map((link) => (
                                    <div key={link.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                                    <LinkIcon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-white truncate">{link.campaign_name}</h4>
                                                    <p className="text-xs text-muted-foreground font-mono mt-0.5 flex items-center gap-1 truncate">
                                                        nxs.gg/a/{link.slug}
                                                        <ExternalLink className="h-3 w-3 opacity-50 hover:opacity-100 cursor-pointer flex-shrink-0" />
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-9 w-9 p-0 rounded-lg"
                                                    onClick={() => handleCopyLink(link.slug)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-9 w-9 p-0 rounded-lg text-red-400 hover:text-red-300"
                                                    onClick={() => handleDeleteLink(link.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/5">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                                                    <MousePointer2 className="h-3 w-3" />
                                                    <p className="text-xs uppercase tracking-wider">Clicks</p>
                                                </div>
                                                <p className="text-sm font-bold text-white">{link.total_clicks.toLocaleString()}</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                                                    <TrendingUp className="h-3 w-3" />
                                                    <p className="text-xs uppercase tracking-wider">Conversions</p>
                                                </div>
                                                <p className="text-sm font-bold text-white">{link.total_conversions.toLocaleString()}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">Revenue</p>
                                                <p className="text-sm font-bold text-white">${parseFloat(link.total_revenue).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <p className="text-muted-foreground">No links created yet</p>
                                <p className="text-sm text-muted-foreground/70 mt-1">Generate your first tracking link to get started</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}
