import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
    title: "Hotel Booking Management",
    description: "Hotel Booking Management Application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-zinc-50">
                <Providers>
                    <Navbar />
                    <main>{children}</main>
                </Providers>
            </body>
        </html>
    );
}