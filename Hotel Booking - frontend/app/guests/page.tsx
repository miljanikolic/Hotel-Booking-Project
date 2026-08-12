"use client";

import { useEffect, useState } from "react";
import { getGuests } from "@/lib/api";

export default function GuestsPage() {
    const [guests, setGuests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadGuests() {
            try {
                const data = await getGuests();
                setGuests(data);
            } catch (error) {
                console.error("Error loading guests:", error);
                setError("Unable to load guests.");
            } finally {
                setLoading(false);
            }
        }

        loadGuests();
    }, []);

    if (loading) {
        return <p className="p-6">Loading guests...</p>;
    }

    if (error) {
        return <p className="p-6 text-red-600">{error}</p>;
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="mb-6 text-3xl font-bold">Guests</h1>

            {guests.length === 0 ? (
                <p>No guests found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-4">First Name</th>
                                <th className="p-4">Last Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Phone Number</th>
                            </tr>
                        </thead>

                        <tbody>
                            {guests.map((guest) => (
                                <tr key={guest.id} className="border-b">
                                    <td className="p-4">
                                        {guest.firstName}
                                    </td>

                                    <td className="p-4">
                                        {guest.lastName}
                                    </td>

                                    <td className="p-4">
                                        {guest.email}
                                    </td>

                                    <td className="p-4">
                                        {guest.phoneNumber}
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