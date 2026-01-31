"use client"
import { User, Lock, Bell, Shield, Wallet } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences and security.</p>
                </div>
            </div>

            {/* Profile Info */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Full Name</label>
                        <Input defaultValue="John Doe" className="bg-black/20" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Email Address</label>
                        <Input defaultValue="john.doe@nexusplay.com" className="bg-black/20" disabled />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Telegram ID</label>
                        <Input defaultValue="@johndoe_official" className="bg-black/20" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Phone Number</label>
                        <Input defaultValue="+1 (555) 000-0000" className="bg-black/20" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button variant="glow">Save Changes</Button>
                </div>
            </Card>

            {/* Security */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Security
                </h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Lock className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Change Password</h4>
                                <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Two-Factor Authentication</h4>
                                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Enable 2FA</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
