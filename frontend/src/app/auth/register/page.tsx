"use client"
import { AuthCard } from "@/features/auth/AuthCard"

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <AuthCard initialMode="register" />
        </div>
    )
}
