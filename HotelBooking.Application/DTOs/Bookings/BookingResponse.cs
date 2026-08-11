using HotelBooking.Entities;

namespace HotelBooking.Application.DTOs.Bookings
{
    public class BookingResponse
    {
        public int Id { get; set; }

        public int GuestId { get; set; }
        public string GuestName { get; set; } = string.Empty;

        public int RoomId { get; set; }
        public int RoomNumber { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        public decimal TotalBookingPrice { get; set; }

        public BookingStatus BookingStatus { get; set; }
    }
}