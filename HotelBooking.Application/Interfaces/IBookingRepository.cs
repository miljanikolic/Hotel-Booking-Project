using HotelBooking.Entities;


namespace HotelBooking.Application.Interfaces
{
    public interface IBookingRepository
    {
        void Create(Booking booking);
        Booking? GetById(int bookingId);
        List<Booking> GetAllBookings();
        void Update(Booking booking);
        void Cancel(int bookingId);

        bool HasOverlappingBooking(
            int roomId,
            DateOnly checkInDate,
            DateOnly checkOutDate,
            int? bookingId = null);
    }
}
