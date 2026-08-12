"use client";

import { useEffect, useState } from "react";
import {
    Guest,
    GuestRequest,
    createGuest,
    deleteGuest,
    getGuests,
    updateGuest,
} from "@/lib/api";

const emptyForm: GuestRequest = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
};

export default function GuestsPage() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingGuestId, setEditingGuestId] = useState<number | null>(
        null
    );

    const [form, setForm] = useState<GuestRequest>(emptyForm);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadGuests();
    }, []);

    async function loadGuests() {
        try {
            setLoading(true);
            setError("");

            const data = await getGuests();
            setGuests(data);
        } catch {
            setError("Unable to load guests.");
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function openCreateForm() {
        setEditingGuestId(null);
        setForm(emptyForm);
        setFormError("");
        setShowForm(true);
    }

    function openEditForm(guest: Guest) {
        setEditingGuestId(guest.id);

        setForm({
            firstName: guest.firstName,
            lastName: guest.lastName,
            email: guest.email,
            phoneNumber: guest.phoneNumber,
        });

        setFormError("");
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingGuestId(null);
        setForm(emptyForm);
        setFormError("");
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        try {
            setSaving(true);
            setFormError("");

            if (editingGuestId === null) {
                const createdGuest = await createGuest(form);

                setGuests((current) => [
                    ...current,
                    createdGuest,
                ]);
            } else {
                const updatedGuest = await updateGuest(
                    editingGuestId,
                    form
                );

                setGuests((current) =>
                    current.map((guest) =>
                        guest.id === editingGuestId
                            ? updatedGuest
                            : guest
                    )
                );
            }

            closeForm();
        } catch (error) {
            setFormError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this guest?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteGuest(id);

            setGuests((current) =>
                current.filter((guest) => guest.id !== id)
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to delete guest."
            );
        }
    }

    const filteredGuests = guests.filter((guest) => {
        const search = searchTerm.toLowerCase().trim();

        if (!search) {
            return true;
        }

        return (
            guest.firstName.toLowerCase().includes(search) ||
            guest.lastName.toLowerCase().includes(search) ||
            guest.email.toLowerCase().includes(search) ||
            guest.phoneNumber.toLowerCase().includes(search)
        );
    });

    if (loading) {
        return <p className="p-6">Loading guests...</p>;
    }

    if (error && guests.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-10">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Guests
                </h1>
                
            </div>

            {!showForm && (
                <div className="mb-6 flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        className="w-full rounded-lg border p-3 shadow-sm md:w-1/2"
                    />

                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="rounded border px-4 py-2 hover:bg-gray-100"
                        >
                            Clear
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="ml-auto whitespace-nowrap rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                    >
                        + Add Guest
                    </button>
                </div>
            )}

            {error && (
                <p className="mb-4 text-red-600">
                    {error}
                </p>
            )}

            {/* Form */}
            {showForm && (
                <div className="mb-8 rounded-lg border bg-gray-50 p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                        {editingGuestId === null
                            ? "Add Guest"
                            : "Edit Guest"}
                    </h2>

                    {formError && (
                        <p className="mb-4 text-red-600">
                            {formError}
                        </p>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        <input
                            name="firstName"
                            placeholder="First name"
                            value={form.firstName}
                            onChange={handleInputChange}
                            required
                            className="rounded border px-4 py-2"
                        />

                        <input
                            name="lastName"
                            placeholder="Last name"
                            value={form.lastName}
                            onChange={handleInputChange}
                            required
                            className="rounded border px-4 py-2"
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleInputChange}
                            required
                            className="rounded border px-4 py-2"
                        />

                        <input
                            name="phoneNumber"
                            placeholder="Phone number"
                            value={form.phoneNumber}
                            onChange={handleInputChange}
                            required
                            className="rounded border px-4 py-2"
                        />

                        <div className="flex gap-3 md:col-span-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingGuestId === null
                                    ? "Create Guest"
                                    : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded border px-4 py-2 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Guests table */}
            {filteredGuests.length === 0 ? (
                <div className="rounded border bg-gray-50 p-8 text-center">
                    {guests.length === 0 ? (
                        <p>No guests have been added yet.</p>
                    ) : (
                        <>
                            <p className="mb-3">
                                No guests match your search.
                            </p>

                            <button
                                onClick={() => setSearchTerm("")}
                                className="text-blue-600 hover:underline"
                            >
                                Clear search
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-4">
                                    Guest Name
                                </th>

                                <th className="p-4">
                                    Email
                                </th>

                                <th className="p-4">
                                    Phone
                                </th>

                                <th className="p-4">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredGuests.map((guest) => (
                                <tr
                                    key={guest.id}
                                    className="border-b"
                                >
                                    <td className="p-4">
                                        {guest.firstName}{" "}
                                        {guest.lastName}
                                    </td>

                                    <td className="p-4">
                                        {guest.email}
                                    </td>

                                    <td className="p-4">
                                        {guest.phoneNumber}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    openEditForm(
                                                        guest
                                                    )
                                                }
                                                className="rounded bg-yellow-500 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        guest.id
                                                    )
                                                }
                                                className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
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