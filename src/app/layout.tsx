import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
    subsets: ["latin"],
    variable: "--font-nunito",
    weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "Pastel Planner | For my Love",
    description: "A cute little app to plan our perfect date ❤️",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
};

import { QuizProvider } from "@/context/QuizContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={nunito.variable}>
            <body className="font-sans bg-cream-50 text-charcoal-muted antialiased overflow-x-hidden selection:bg-pastel-pink selection:text-white">
                <QuizProvider>
                    {children}
                </QuizProvider>
            </body>
        </html>
    );
}
