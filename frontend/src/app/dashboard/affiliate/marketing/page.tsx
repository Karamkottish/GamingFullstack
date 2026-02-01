"use client"
import { Download, Image, FileText, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

// Assets with real generated images
const ASSETS = [
    { id: 1, title: "NexusPlay Brand Assets", type: "ZIP", size: "12MB", category: "Branding", icon: FileText, image: "/assets/marketing_logos.png" },
    { id: 2, title: "Grand Lobby Casino Promo", type: "PNG", size: "3.4MB", category: "Social Media", icon: Image, image: "/assets/casino_banner.png" },
    { id: 3, title: "Sportsbook AI Dynamic Banner", type: "JPG", size: "2.1MB", category: "Banners", icon: Smartphone, image: "/assets/sportsbook_banner.png" },
    { id: 4, title: "Affiliate UI Kit 2027", type: "PDF", size: "5.6MB", category: "Documents", icon: FileText, image: "/assets/marketing_logos.png" },
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
                        <div className="aspect-video bg-white/5 relative flex items-center justify-center overflow-hidden">
                            {asset.image ? (
                                <img src={asset.image} alt={asset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <asset.icon className="h-12 w-12 text-muted-foreground group-hover:text-white transition-colors opacity-50 group-hover:opacity-100" />
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                <Button size="sm" className="w-3/4 gap-2">
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
