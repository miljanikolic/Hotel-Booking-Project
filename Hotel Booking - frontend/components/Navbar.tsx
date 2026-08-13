"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();

    function handleLogout() {
        logout();
        router.push("/login");
    }

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <Link href="/" className="text-xl font-bold">
                    Hotel Booking
                </Link>

                {isAuthenticated ? (
                    <>
                        <div className="flex items-center gap-6">
                            <Link href="/rooms" className="hover:text-gray-300">
                                Rooms
                            </Link>

                            <Link href="/guests" className="hover:text-gray-300">
                                Guests
                            </Link>

                            <Link href="/bookings" className="hover:text-gray-300">
                                Bookings
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-sm font-semibold">{user?.username}</div>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded border border-gray-600 px-3 py-1.5 text-sm hover:bg-gray-700"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <Link href="/login" className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500">
                    Login
                    </Link>
                )}
            </div>
        </nav>
    );
}