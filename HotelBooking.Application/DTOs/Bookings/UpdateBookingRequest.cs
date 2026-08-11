namespace HotelBooking.Application.DTOs.Bookings
{
    public class UpdateBookingRequest
    {
        public int GuestId { get; set; }
        public int RoomId { get; set; }
        public DateOnly CheckInDate { get; set; }
        public DateOnly CheckOutDate { get; set; }
    }
}