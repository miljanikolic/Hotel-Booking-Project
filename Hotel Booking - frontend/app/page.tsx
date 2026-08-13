"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import {
    getRooms,
    getGuests,
    getBookings,
} from "@/lib/api";

export default function Dashboard() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [roomsCount, setRoomsCount] = useState(0);
    const [guestsCount, setGuestsCount] = useState(0);
    const [bookingsCount, setBookingsCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!isAuthenticated) {
            setLoading(false);
            setError("");
            return;
        }

        async function loadDashboardData() {
            try {
                setError("");

                const [rooms, guests, bookings] =
                    await Promise.all([
                        getRooms(),
                        getGuests(),
                        getBookings(),
                    ]);

                setRoomsCount(rooms.length);
                setGuestsCount(guests.length);
                setBookingsCount(bookings.length);
            } catch (error) {
                console.error(
                    "Error loading dashboard data:",
                    error
                );

                setError(
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, [authLoading, isAuthenticated]);

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Hotel Booking Management System
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-medium text-gray-500">
                            Total Rooms
                        </h2>

                        <p className="mt-2 text-3xl font-bold">
                            {loading ? "..." : roomsCount}
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-medium text-gray-500">
                            Total Guests
                        </h2>

                        <p className="mt-2 text-3xl font-bold">
                            {loading ? "..." : guestsCount}
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-medium text-gray-500">
                            Total Bookings
                        </h2>

                        <p className="mt-2 text-3xl font-bold">
                            {loading ? "..." : bookingsCount}
                        </p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}