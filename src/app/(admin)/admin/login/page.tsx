"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SoftCard } from "@/components/ui/SoftCard";
import { SoftInput } from "@/components/ui/SoftInput";
import { SoftButton } from "@/components/ui/SoftButton";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple client-side check for demo. In prod, use NextAuth or similar.
        const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
        if (password === ADMIN_PASS) {
            router.push("/admin/dashboard");
        } else {
            alert("Wrong password!");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <SoftCard className="w-full max-w-sm space-y-6">
                <h1 className="text-2xl font-bold text-center">Admin Access</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <SoftInput
                        type="password"
                        placeholder="Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <SoftButton type="submit" className="w-full">
                        Enter Dashboard
                    </SoftButton>
                </form>
            </SoftCard>
        </main>
    );
}
