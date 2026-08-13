"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import {
    Booking,
    BookingRequest,
    Guest,
    Room,
    cancelBooking,
    createBooking,
    getBookings,
    getGuests,
    getRooms,
    updateBooking,
} from "@/lib/api";

const emptyForm: BookingRequest = {
    guestId: 0,
    roomId: 0,
    checkInDate: "",
    checkOutDate: "",
};

function getBookingStatusName(status: number): string {
    switch (status) {
        case 0:
            return "Confirmed";
        case 1:
            return "Cancelled";
        default:
            return "Unknown";
    }
}

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

function calculateNights(checkInDate: string, checkOutDate: string): number {
    if (!checkInDate || !checkOutDate) {
        return 0;
    }

    const checkIn = new Date(`${checkInDate}T00:00:00`);
    const checkOut = new Date(`${checkOutDate}T00:00:00`);
    const difference = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function formatDate(date: string): string {
    if (!date) {
        return "";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString();
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
    const [form, setForm] = useState<BookingRequest>(emptyForm);
    const [saving, setSaving] = useState(false);

    async function loadData() {
        try {
            setError("");
            const [bookingData, guestData, roomData] = await Promise.all([
                getBookings(),
                getGuests(),
                getRooms(),
            ]);

            setBookings(bookingData);
            setGuests(guestData);
            setRooms(roomData);
        } catch (error) {
            console.error("Error loading booking data:", error);
            setError("Unable to load bookings.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function handleInputChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: name === "guestId" || name === "roomId" ? Number(value) : value,
        }));
    }

    function openCreateForm() {
        setEditingBookingId(null);
        setForm({
            ...emptyForm,
            guestId: guests.length > 0 ? guests[0].id : 0,
            roomId: rooms.length > 0 ? rooms[0].id : 0,
        });
        setError("");
        setShowForm(true);
    }

    function openEditForm(booking: Booking) {
        setEditingBookingId(booking.id);
        setForm({
            guestId: booking.guestId,
            roomId: booking.roomId,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
        });
        setError("");
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingBookingId(null);
        setForm(emptyForm);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            if (form.guestId === 0 || form.roomId === 0) {
                throw new Error("Please select a guest and a room.");
            }

            if (!form.checkInDate || !form.checkOutDate) {
                throw new Error("Please select check-in and check-out dates.");
            }

            const nights = calculateNights(form.checkInDate, form.checkOutDate);
            if (nights <= 0) {
                throw new Error("Check-out date must be after check-in date.");
            }

            if (editingBookingId === null) {
                await createBooking(form);
            } else {
                await updateBooking(editingBookingId, form);
            }

            await loadData();
            closeForm();
        } catch (error) {
            console.error("Error saving booking:", error);
            setError(error instanceof Error ? error.message : "Unable to save booking.");
        } finally {
            setSaving(false);
        }
    }

    async function handleCancel(booking: Booking) {
        const confirmed = window.confirm(
            `Are you sure you want to cancel the booking for ${booking.guestName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            await cancelBooking(booking.id);
            await loadData();
        } catch (error) {
            console.error("Error cancelling booking:", error);
            setError(error instanceof Error ? error.message : "Unable to cancel booking.");
        }
    }

    if (loading) {
        return <p className="p-6">Loading bookings...</p>;
    }

    const selectedRoom = rooms.find((room) => room.id === form.roomId);
    const filteredBookings = bookings.filter((booking) => {
        const search = searchTerm.toLowerCase().trim();

        if (!search) {
            return true;
        }

        const guestName = booking.guestName.toLowerCase();
        const roomNumber = booking.roomNumber.toString();
        const status = getBookingStatusName(booking.bookingStatus).toLowerCase();

        return guestName.includes(search) || roomNumber.includes(search) || status.includes(search);
    });

    const nights = calculateNights(form.checkInDate, form.checkOutDate);
    const estimatedTotal = selectedRoom && nights > 0 ? selectedRoom.pricePerNight * nights : 0;

    return (
        <ProtectedRoute>
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Bookings</h1>
                </div>

                {!showForm && (
                    <div className="mb-6 flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search by guest, room or status..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="w-full rounded-lg border p-3 shadow-sm md:w-1/2"
                        />

                        <button
                            type="button"
                            onClick={openCreateForm}
                            disabled={guests.length === 0 || rooms.length === 0}
                            className="ml-auto w-32 whitespace-nowrap rounded bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            + Add Booking
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
                )}

                {guests.length === 0 && (
                    <div className="mb-6 rounded-lg bg-yellow-100 p-4 text-yellow-800">
                        You need at least one guest before creating a booking.
                    </div>
                )}

                {rooms.length === 0 && (
                    <div className="mb-6 rounded-lg bg-yellow-100 p-4 text-yellow-800">
                        You need at least one room before creating a booking.
                    </div>
                )}

                {showForm && (
                    <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-semibold">
                            {editingBookingId === null ? "Create Booking" : "Edit Booking"}
                        </h2>

                        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="guestId" className="mb-1 block font-medium">
                                    Guest
                                </label>
                                <select
                                    id="guestId"
                                    name="guestId"
                                    value={form.guestId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-lg border p-2"
                                >
                                    <option value={0}>Select guest</option>
                                    {guests.map((guest) => (
                                        <option key={guest.id} value={guest.id}>
                                            {guest.firstName} {guest.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="roomId" className="mb-1 block font-medium">
                                    Room
                                </label>
                                <select
                                    id="roomId"
                                    name="roomId"
                                    value={form.roomId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-lg border p-2"
                                >
                                    <option value={0}>Select room</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            Room {room.roomNumber} - {getRoomTypeName(room.roomType)} (€{room.pricePerNight}/night)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="checkInDate" className="mb-1 block font-medium">
                                    Check-in Date
                                </label>
                                <input
                                    id="checkInDate"
                                    name="checkInDate"
                                    type="date"
                                    value={form.checkInDate}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-lg border p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="checkOutDate" className="mb-1 block font-medium">
                                    Check-out Date
                                </label>
                                <input
                                    id="checkOutDate"
                                    name="checkOutDate"
                                    type="date"
                                    value={form.checkOutDate}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-lg border p-2"
                                />
                            </div>

                            <div className="rounded-lg bg-gray-100 p-4 md:col-span-2">
                                <div className="flex justify-between">
                                    <span>Number of nights:</span>
                                    <strong>{nights > 0 ? nights : "-"}</strong>
                                </div>

                                <div className="mt-2 flex justify-between">
                                    <span>Estimated total:</span>
                                    <strong>
                                        {estimatedTotal > 0 ? `€${estimatedTotal.toFixed(2)}` : "-"}
                                    </strong>
                                </div>

                                <p className="mt-2 text-sm text-gray-500">
                                    The final booking price is calculated by the backend.
                                </p>
                            </div>

                            <div className="flex gap-3 md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : editingBookingId === null ? "Create Booking" : "Save Changes"}
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

                {filteredBookings.length === 0 ? (
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
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="border-b">
                                        <td className="p-4">{booking.guestName}</td>
                                        <td className="p-4">{booking.roomNumber}</td>
                                        <td className="p-4">{formatDate(booking.checkInDate)}</td>
                                        <td className="p-4">{formatDate(booking.checkOutDate)}</td>
                                        <td className="p-4">€{booking.totalBookingPrice.toFixed(2)}</td>
                                        <td className="p-4">{getBookingStatusName(booking.bookingStatus)}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {booking.bookingStatus === 0 && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditForm(booking)}
                                                            className="rounded-md bg-yellow-500 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-600"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCancel(booking)}
                                                            className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}

                                                {booking.bookingStatus === 1 && (
                                                    <span className="text-sm text-gray-500">Cancelled</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}