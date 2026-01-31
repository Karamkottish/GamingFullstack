"use client"
import { Download, Image, FileText, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

// Dummy Assets
const ASSETS = [
    { id: 1, title: "Main Logo Pack", type: "ZIP", size: "12MB", category: "Branding", icon: FileText },
    { id: 2, title: "Summer Promo Banner 1080x1080", type: "PNG", size: "2.4MB", category: "Social Media", icon: Image },
    { id: 3, title: "Story Templates", type: "PSD", size: "45MB", category: "Social Media", icon: Smartphone },
    { id: 4, title: "Casino Lobby Screenshot", type: "JPG", size: "1.2MB", category: "Screenshots", icon: Image },
    { id: 5, title: "Brand Guidelines 2027", type: "PDF", size: "5.6MB", category: "Documents", icon: FileText },
    { id: 6, title: "Sportsbook Feed Widget", type: "HTML", size: "15KB", category: "Widgets", icon: FileText },
]

export default function AffiliateMarketingPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Marketing Assets</h1>
                    <p className="text-muted-foreground">High-quality creatives to boost your campaigns.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">All Formats</Button>
                    <Button variant="outline">Images</Button>
                    <Button variant="outline">Videos</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ASSETS.map((asset) => (
                    <Card key={asset.id} className="group bg-black/40 border-white/10 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all">
                        <div className="aspect-video bg-white/5 relative flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <asset.icon className="h-12 w-12 text-muted-foreground group-hover:text-white transition-colors opacity-50 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <Button size="sm" className="w-full gap-2">
                                    <Download className="h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="font-semibold text-white truncate pr-2" title={asset.title}>{asset.title}</h4>
                                    <p className="text-xs text-muted-foreground">{asset.category}</p>
                                </div>
                                <span className="text-xs font-mono bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground">{asset.type}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-white/5">
                                <span>Size: {asset.size}</span>
                                <span>Updated: 2d ago</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
