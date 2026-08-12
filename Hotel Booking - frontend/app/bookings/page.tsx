"use client";

import { useEffect, useState } from "react";
import { getBookings} from "@/lib/api";

function getBookingStatus(status: number) {
    switch (status) {
        case 0:
            return "Confirmed";
        case 1:
            return "Cancelled";
        default:
            return "Unknown";
    }
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadBookings() {
            try {
                const data = await getBookings();
                setBookings(data);
            } catch (error) {
                // setError("Unable to load bookings.");
                console.error("ERROR LOADING ROOMS:", error);
                setError("Unable to load rooms.");
            } finally {
                setLoading(false);
            }
        }

        loadBookings();
    }, []);

    if (loading) {
        return <p className="p-6">Loading bookings...</p>;
    }

    if (error) {
        return <p className="p-6 text-red-600">{error}</p>;
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="mb-6 text-3xl font-bold">Bookings</h1>

            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-4">Guest</th>
                                <th className="p-4">Room</th>
                                <th className="p-4">Check-in</th>
                                <th className="p-4">Check-out</th>
                                <th className="p-4">Total Price</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    className="border-b"
                                >
                                    <td className="p-4">
                                        {booking.guestName}
                                    </td>

                                    <td className="p-4">
                                        Room {booking.roomNumber}
                                    </td>

                                    <td className="p-4">
                                        {booking.checkInDate}
                                    </td>

                                    <td className="p-4">
                                        {booking.checkOutDate}
                                    </td>

                                    <td className="p-4">
                                        €{booking.totalBookingPrice}
                                    </td>

                                    <td className="p-4">
                                        {getBookingStatus(booking.bookingStatus)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}