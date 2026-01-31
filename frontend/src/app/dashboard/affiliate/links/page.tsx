"use client"
import { Copy, Plus, Filter, Link as LinkIcon, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"

// Dummy Links Data
const REFERRAL_LINKS = [
    { id: 1, name: "Instagram Bio Main", slug: "nexusplay.com/r/kjd8s", clicks: 5432, signups: 120, created: "2024-01-15" },
    { id: 2, name: "Youtube Winter Campaign", slug: "nexusplay.com/r/winter24", clicks: 1200, signups: 45, created: "2024-02-01" },
    { id: 3, name: "Telegram Group", slug: "nexusplay.com/r/tg-group-1", clicks: 8900, signups: 450, created: "2023-12-10" },
    { id: 4, name: "Twitter Promo", slug: "nexusplay.com/r/twitter-ad", clicks: 320, signups: 10, created: "2024-03-10" },
]

export default function AffiliateLinksPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Referral Links</h1>
                    <p className="text-muted-foreground">Create and manage your tracking links.</p>
                </div>
                <Button variant="glow" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Link
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Link Generator */}
                <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm h-fit">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Generator</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Campaign Name</label>
                            <Input placeholder="e.g. TikTok Profile" className="bg-black/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Landing Page</label>
                            <select className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50">
                                <option>Home Page (Default)</option>
                                <option>Casino Lobby</option>
                                <option>Sportsbook</option>
                                <option>Register Page</option>
                            </select>
                        </div>
                        <Button className="w-full" variant="outline">
                            Generate Link
                        </Button>
                    </div>
                </Card>

                {/* Active Links List */}
                <div className="lg:col-span-2">
                    <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Active Campaigns</h3>
                        <div className="space-y-4">
                            {REFERRAL_LINKS.map((link) => (
                                <div key={link.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                            <LinkIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">{link.name}</h4>
                                            <p className="text-xs text-muted-foreground font-mono mt-0.5 flex items-center gap-1">
                                                {link.slug}
                                                <ExternalLink className="h-3 w-3 opacity-50 hover:opacity-100 cursor-pointer" />
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Clicks</p>
                                            <p className="text-sm font-bold text-white">{link.clicks.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Signups</p>
                                            <p className="text-sm font-bold text-green-400">{link.signups.toLocaleString()}</p>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-9 w-9 p-0 rounded-lg">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
