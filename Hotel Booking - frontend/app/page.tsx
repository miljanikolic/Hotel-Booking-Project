export default function Dashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="mt-2 text-gray-600">
                    Hotel Booking Management System
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-medium text-gray-500">
                        Total Rooms
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        0
                    </p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-medium text-gray-500">
                        Total Guests
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        0
                    </p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-medium text-gray-500">
                        Total Bookings
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        0
                    </p>
                </div>
            </div>
        </div>
    );
}