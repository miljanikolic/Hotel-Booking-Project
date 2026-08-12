import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}