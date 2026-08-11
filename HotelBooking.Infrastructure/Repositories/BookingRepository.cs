using HotelBooking.Application.Interfaces;
using HotelBooking.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AppDbContext _context;

        public BookingRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Create(Booking booking)
        {
            _context.Bookings.Add(booking);
            _context.SaveChanges();
        }

        public Booking? GetById(int bookingId)
        {
            return _context.Bookings
                .Include(b => b.Guest)
                .Include(b => b.Room)
                .FirstOrDefault(b => b.Id == bookingId);
        }

        public List<Booking> GetAllBookings()
        {
            return _context.Bookings
                .Include(b => b.Guest)
                .Include(b => b.Room)
                .AsNoTracking()
                .ToList();
        }

        public void Update(Booking booking)
        {
            _context.Bookings.Update(booking);
            _context.SaveChanges();
        }

        public void Cancel(int bookingId)
        {
            Booking? booking = _context.Bookings
                .FirstOrDefault(b => b.Id == bookingId);

            if (booking == null)
            {
                return;
            }

            booking.BookingStatus = BookingStatus.Cancelled;

            _context.SaveChanges();
        }

        public bool HasOverlappingBooking(
            int roomId,
            DateOnly checkInDate,
            DateOnly checkOutDate,
            int? bookingId = null)
        {
            return _context.Bookings.Any(b =>
                b.RoomId == roomId &&
                b.BookingStatus != BookingStatus.Cancelled &&
                (!bookingId.HasValue || b.Id != bookingId.Value) &&
                checkInDate < b.CheckOutDate &&
                checkOutDate > b.CheckInDate);
        }
    }
}