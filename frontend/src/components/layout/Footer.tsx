import Link from "next/link"
import { Gamepad2, Twitter, Github, Linkedin, Disc as Discord } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-background/50 backdrop-blur-lg">
            <div className="container px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                                <Gamepad2 className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-lg font-bold">NexusPlay</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            The enterprise standard for iGaming platforms.
                            Secure, scalable, and built for the future of gambling.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Casino API</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Sportsbook</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Agent System</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Affiliate Network</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Customers</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Compliance</Link></li>
                        </ul>
                        <div className="flex gap-4 mt-6">
                            <Link href="#" className="text-muted-foreground hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
                            <Link href="#" className="text-muted-foreground hover:text-white transition-colors"><Discord className="h-5 w-5" /></Link>
                            <Link href="#" className="text-muted-foreground hover:text-white transition-colors"><Github className="h-5 w-5" /></Link>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
                    © 2027 NexusPlay Solutions. All rights reserved. 18+ Gambling Responsibly.
                </div>
            </div>
        </footer>
    )
}
