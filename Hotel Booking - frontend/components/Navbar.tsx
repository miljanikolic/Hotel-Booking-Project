import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                    Hotel Booking
                </Link>

                <div className="flex gap-6">
                    {/* <Link href="/" className="hover:text-gray-300">
                        Dashboard
                    </Link> */}

                    <Link href="/rooms" className="hover:text-gray-300">
                        Rooms
                    </Link>

                    <Link href="/guests" className="hover:text-gray-300">
                        Guests
                    </Link>

                    <Link href="/bookings" className="hover:text-gray-300">
                        Bookings
                    </Link>
                </div>
            </div>
        </nav>
    );
}