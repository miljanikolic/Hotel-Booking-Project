const API_URL = "http://localhost:5291/api";


export interface Room {
    id: number;
    roomNumber: number;
    roomType: number;
    capacity: number;
    pricePerNight: number;
    roomStatus: number;
}

export async function getRooms(): Promise<Room[]> {
    const response = await fetch(`${API_URL}/Room`);

    if (!response.ok) {
        throw new Error("Failed to fetch rooms");
    }

    return response.json();
}

export async function getGuests() {
    const response = await fetch(`${API_URL}/Guest`);

    if (!response.ok) {
        throw new Error("Failed to fetch guests");
    }

    return response.json();
}   

export async function getBookings() {
    const response = await fetch(`${API_URL}/Booking`);

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return response.json();
}   