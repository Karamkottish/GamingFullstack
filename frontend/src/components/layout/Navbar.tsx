"use client"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Gamepad2, Menu } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Gamepad2 className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                        Nexus<span className="text-primary">Play</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Solutions
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Pricing
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <ThemeToggle />
                    <Button variant="ghost" size="sm">Log in</Button>
                    <Button variant="glow" size="sm">Get Started</Button>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-3xl"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            <Link href="#features" className="text-sm font-medium p-2 hover:bg-white/5 rounded-md">Features</Link>
                            <Link href="#solutions" className="text-sm font-medium p-2 hover:bg-white/5 rounded-md">Solutions</Link>
                            <Button variant="ghost" className="w-full justify-start">Log in</Button>
                            <Button variant="glow" className="w-full">Get Started</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
