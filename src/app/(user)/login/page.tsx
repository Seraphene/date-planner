"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SoftButton } from "@/components/ui/SoftButton";
import { SoftInput } from "@/components/ui/SoftInput";
import { SoftCard } from "@/components/ui/SoftCard";

export default function LoginPage() {
    const [secret, setSecret] = useState("");
    const [error, setError] = useState(false);
    const router = useRouter();

    // In a real app, verify against env variable on server
    // For demo, we'll use a hardcoded simple secret or env if available
    const SHARED_SECRET = process.env.NEXT_PUBLIC_SHARED_SECRET || "1234";

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (secret === SHARED_SECRET) {
            router.push("/"); // Redirect to Welcome Dashboard
        } else {
            setError(true);
            // Shake animation effect could be added here
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-pastel-pink/20 to-pastel-mint/20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm"
            >
                <SoftCard className="flex flex-col items-center space-y-6 text-center">
                    <div className="text-4xl">🔒</div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Secret Access
                    </h1>
                    <p className="text-sm text-gray-500">
                        Enter our special date (MMDD) to continue.
                    </p>

                    <form onSubmit={handleLogin} className="w-full space-y-4">
                        <SoftInput
                            type="password"
                            placeholder="Enter the code..."
                            value={secret}
                            onChange={(e) => {
                                setSecret(e.target.value);
                                setError(false);
                            }}
                            error={error}
                            className="text-center tracking-widest"
                            maxLength={10}
                        />

                        <SoftButton
                            type="submit"
                            className="w-full"
                            disabled={!secret}
                        >
                            Unlock My Gift
                        </SoftButton>
                    </form>
                </SoftCard>
            </motion.div>
        </main>
    );
}
