"use client";

import { useEffect, useState } from "react";
import { getRooms, Room } from "@/lib/api";

function getRoomTypeName(roomType: number): string {
    switch (roomType) {
        case 0:
            return "Single";
        case 1:
            return "Double";
        case 2  :
            return "Family";
        default:
            return "Unknown";
    }
}

function getRoomStatusName(roomStatus: number): string {
    switch (roomStatus) {
        case 0:
            return "Available";
        case 1:
            return "Maintenance";
        case 2:
            return "Unavailable";
        default:
            return "Unknown";
    }
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadRooms() {
            try {
                const data = await getRooms();
                setRooms(data);
            } catch (error) {
                setError("Unable to load rooms.");
            } finally {
                setLoading(false);
            }
        }

        loadRooms();
    }, []);

    if (loading) {
        return <p className="p-6">Loading rooms...</p>;
    }

    if (error) {
        return <p className="p-6 text-red-600">{error}</p>;
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="mb-6 text-3xl font-bold">Rooms</h1>

            {rooms.length === 0 ? (
                <p>No rooms found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-4">Room Number</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Capacity</th>
                                <th className="p-4">Price / Night</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room.id} className="border-b">
                                    <td className="p-4">
                                        {room.roomNumber}
                                    </td>

                                    <td className="p-4">
                                        {getRoomTypeName(room.roomType)}
                                    </td>

                                    <td className="p-4">
                                        {room.capacity}
                                    </td>

                                    <td className="p-4">
                                        €{room.pricePerNight}
                                    </td>

                                    <td className="p-4">
                                        {getRoomStatusName(room.roomStatus)}
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