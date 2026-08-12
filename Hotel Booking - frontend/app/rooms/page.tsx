"use client";

import { useEffect, useState } from "react";
import {
    createRoom,
    deleteRoom,
    getRooms,
    Room,
    RoomRequest,
    updateRoom,
} from "@/lib/api";

const emptyForm: RoomRequest = {
    roomNumber: 0,
    roomType: 0,
    capacity: 1,
    pricePerNight: 0,
    roomStatus: 0,
};

function getRoomTypeName(roomType: number): string {
    switch (roomType) {
        case 0:
            return "Single";
        case 1:
            return "Double";
        case 2:
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

    const [showForm, setShowForm] = useState(false);
    const [editingRoomId, setEditingRoomId] = useState<number | null>(null);

    const [form, setForm] = useState<RoomRequest>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roomTypeFilter, setRoomTypeFilter] = useState("all");
    const [roomStatusFilter, setRoomStatusFilter] = useState("all");
    
    async function loadRooms() {
        try {
            setError("");

            const data = await getRooms();
            setRooms(data);
        } catch (error) {
            console.error("Error loading rooms:", error);
            setError("Unable to load rooms.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRooms();
    }, []);

    function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) {
    const { name, value } = event.target;

    if (name === "roomType") {
        const roomType = Number(value);

        setForm((current) => ({
            ...current,
            roomType,
            capacity:
                roomType === 0
                    ? 1
                    : roomType === 1
                    ? 2
                    : current.capacity,
        }));

        return;
    }

    setForm((current) => ({
        ...current,
        [name]:
            name === "roomNumber" ||
            name === "roomType" ||
            name === "capacity" ||
            name === "pricePerNight"
                ? Number(value)
                : value,
    }));
}

    function openCreateForm() {
        setEditingRoomId(null);
        setForm(emptyForm);
        setError("");
        setShowForm(true);
    }

    function openEditForm(room: Room) {
        setEditingRoomId(room.id);

        setForm({
            roomNumber: room.roomNumber,
            roomType: room.roomType,
            capacity: room.capacity,
            pricePerNight: room.pricePerNight,
            roomStatus: room.roomStatus,
        });

        setError("");
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingRoomId(null);
        setForm(emptyForm);
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setSaving(true);
        setError("");

        const roomData: RoomRequest = {
            roomNumber: Number(form.roomNumber),
            roomType: Number(form.roomType),
            capacity: Number(form.capacity),
            pricePerNight: Number(form.pricePerNight),
            roomStatus: Number(form.roomStatus),
        };

        try {
            if (editingRoomId === null) {
                await createRoom(roomData);
            } else {
                await updateRoom(editingRoomId, roomData);
            }

            await loadRooms();
            closeForm();
        } catch (error) {
            console.error("Error saving room:", error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unable to save room.");
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(room: Room) {
        const confirmed = window.confirm(
            `Are you sure you want to delete room ${room.roomNumber}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteRoom(room.id);

            setRooms((current) =>
                current.filter((item) => item.id !== room.id)
            );
        } catch (error) {
            console.error("Error deleting room:", error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unable to delete room.");
            }
        }
    }

    const filteredRooms = rooms.filter((room) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
        room.roomNumber.toString().includes(search) ||
        getRoomTypeName(room.roomType).toLowerCase().includes(search) ||
        getRoomStatusName(room.roomStatus).toLowerCase().includes(search);

    const matchesType = roomTypeFilter === "all" || room.roomType.toString() === roomTypeFilter;

    const matchesStatus = roomStatusFilter === "all" || room.roomStatus.toString() === roomStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
});

    if (loading) {
        return <p className="p-6">Loading rooms...</p>;
    }


    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="text-3xl font-bold">Rooms</h1>

            {!showForm && (
            <div className="mt-6 flex flex-col gap-4 md:flex-row">
                <input
                    type="text"
                    placeholder="Search by room number, type or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border p-3 shadow-sm md:w-1/2"
                />

                <select
                    value={roomTypeFilter}
                    onChange={(e) => setRoomTypeFilter(e.target.value)}
                    className="rounded-lg border px-4 py-2"
                >
                    <option value="all">All room types</option>
                    <option value="0">Single</option>
                    <option value="1">Double</option>
                    <option value="2">Family</option>
                </select>

                <select
                    value={roomStatusFilter}
                    onChange={(e) => setRoomStatusFilter(e.target.value)}
                    className="rounded-lg border px-4 py-2"
                >
                    <option value="all">All statuses</option>
                    <option value="0">Available</option>
                    <option value="1">Maintenance</option>
                    <option value="2">Unavailable</option>
                </select>
                
                <button
                    type="button"
                    onClick={() => {
                        setSearchTerm("");
                        setRoomTypeFilter("all");
                        setRoomStatusFilter("all");
                    }}
                    className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-100"
                >
                    Clear Filters
                </button>
                <button
                    type="button"
                    onClick={openCreateForm}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                    + Add Room
                </button>
            </div>
            )}
        

            {error && (
                <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-xl font-semibold">
                        {editingRoomId === null
                            ? "Add Room"
                            : "Edit Room"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        {/* Room Number */}
                        <div>
                            <label
                                htmlFor="roomNumber"
                                className="mb-1 block font-medium"
                            >
                                Room Number
                            </label>

                            <input
                                id="roomNumber"
                                name="roomNumber"
                                type="number"
                                min="1"
                                value={form.roomNumber}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border p-2"
                            />
                        </div>

                        {/* Room Type */}
                        <div>
                            <label
                                htmlFor="roomType"
                                className="mb-1 block font-medium"
                            >
                                Room Type
                            </label>

                            <select
                                id="roomType"
                                name="roomType"
                                value={form.roomType}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border p-2"
                            >
                                <option value={0}>Single</option>
                                <option value={1}>Double</option>
                                <option value={2}>Family</option>
                            </select>
                        </div>

                        {/* Capacity */}
                        <div>
                            <label
                                htmlFor="capacity"
                                className="mb-1 block font-medium"
                            >
                                Capacity
                            </label>

                            {form.roomType === 2 ? (
                            <input
                                id="capacity"
                                name="capacity"
                                type="number"
                                min="3"
                                value={form.capacity}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border p-2"
                            />
                        ) : (
                            <input
                                id="capacity"
                                name="capacity"
                                type="number"
                                value={form.roomType === 0 ? 1 : 2}
                                disabled
                                className="w-full rounded-lg border bg-gray-100 p-2 text-gray-600"
                            />
                        )}
                        </div>

                        {/* Price */}
                        <div>
                            <label
                                htmlFor="pricePerNight"
                                className="mb-1 block font-medium"
                            >
                                Price Per Night (€)
                            </label>

                            <input
                                id="pricePerNight"
                                name="pricePerNight"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.pricePerNight}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border p-2"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="roomStatus"
                                className="mb-1 block font-medium"
                            >
                                Status
                            </label>

                            <select
                                id="roomStatus"
                                name="roomStatus"
                                value={form.roomStatus}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border p-2"
                            >
                                <option value={0}>Available</option>
                                <option value={1}>Maintenance</option>
                                <option value={2}>Unavailable</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 md:col-span-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingRoomId === null
                                    ? "Create Room"
                                    : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={saving}
                                className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {filteredRooms.length === 0 ? (
                <p>No rooms match your search or filters.</p>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-4">Room Number</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Capacity</th>
                                <th className="p-4">
                                    Price / Night
                                </th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRooms.map((room) => (
                                <tr
                                    key={room.id}
                                    className="border-b"
                                >
                                    <td className="p-4">
                                        {room.roomNumber}
                                    </td>

                                    <td className="p-4">
                                        {getRoomTypeName(
                                            room.roomType
                                        )}
                                    </td>

                                    <td className="p-4">
                                        {room.capacity}
                                    </td>

                                    <td className="p-4">
                                        €{room.pricePerNight}
                                    </td>

                                    <td className="p-4">
                                        {getRoomStatusName(
                                            room.roomStatus
                                        )}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditForm(room)
                                                }
                                                className="rounded-md bg-yellow-500 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(room)
                                                }
                                                className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
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