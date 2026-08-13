export const API_URL = "http://localhost:5291/api";

export interface AuthUser {
    id: number;
    username: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: AuthUser | null;
}

export function getAuthHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("hotel-booking-token") : null;

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Login failed.");
    }

    return data as AuthResponse;
}

export interface Booking {
    id: number;
    guestId: number;
    guestName: string;
    roomId: number;
    roomNumber: number;
    checkInDate: string;
    checkOutDate: string;
    totalBookingPrice: number;
    bookingStatus: number;
}

export interface BookingRequest {
    guestId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
}

export async function createBooking(
    booking: BookingRequest
): Promise<Booking> {
    const response = await fetch(`${API_URL}/Booking`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(booking),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message || "Failed to create booking"
        );
    }

    return response.json();
}

export async function updateBooking(
    id: number,
    booking: BookingRequest
): Promise<Booking> {
    const response = await fetch(`${API_URL}/Booking/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(booking),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message || "Failed to update booking"
        );
    }

    return response.json();
}

export async function cancelBooking(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/Booking/${id}/cancel`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message || "Failed to cancel booking"
        );
    }
}

export async function getBookings(): Promise<Booking[]> {
    const response = await fetch(`${API_URL}/Booking`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return response.json();
}

export interface Room {
    id: number;
    roomNumber: number;
    roomType: number;
    capacity: number;
    pricePerNight: number;
    roomStatus: number;
}

export interface RoomRequest {
    roomNumber: number;
    roomType: number;
    capacity: number;
    pricePerNight: number;
    roomStatus: number;
}

export async function getRooms(): Promise<Room[]> {
    const response = await fetch(`${API_URL}/Room`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch rooms");
    }

    return response.json();
}

export async function createRoom(
    room: RoomRequest
): Promise<Room> {
    const response = await fetch(`${API_URL}/Room`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(room),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message || "Failed to create room"
        );
    }

    return response.json();
}

export async function updateRoom(
    id: number,
    room: RoomRequest
): Promise<Room> {
    const response = await fetch(`${API_URL}/Room/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(room),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message || "Failed to update room"
        );
    }

    return response.json();
}

export async function deleteRoom(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/Room/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message || "Failed to delete room"
        );
    }
}

export interface Guest {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface GuestRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export async function getGuests(): Promise<Guest[]> {
    const response = await fetch(`${API_URL}/Guest`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch guests");
    }

    return response.json();
}

export async function createGuest(guest: GuestRequest): Promise<Guest> {
    const response = await fetch(`${API_URL}/Guest`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(guest),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Failed to create guest");
    }

    return response.json();
}

export async function updateGuest(guestId: number, guest: GuestRequest): Promise<Guest> {
    const response = await fetch(`${API_URL}/Guest/${guestId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(guest),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Failed to update guest");
    }

    return response.json();
}

export async function deleteGuest(guestId: number): Promise<void> {
    const response = await fetch(`${API_URL}/Guest/${guestId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Failed to delete guest");
    }
}

 