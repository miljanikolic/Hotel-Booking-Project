using HotelBooking.Application.Interfaces;
using HotelBooking.Entities;

namespace HotelBooking.Application.Services
{
    public class BookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IRoomRepository _roomRepository;
        private readonly IGuestRepository _guestRepository;

        public BookingService(
            IBookingRepository bookingRepository,
            IRoomRepository roomRepository,
            IGuestRepository guestRepository)
        {
            _bookingRepository = bookingRepository;
            _roomRepository = roomRepository;
            _guestRepository = guestRepository;
        }

        public void Create(Booking booking)
        {
            if (!booking.ValidateTime())
            {
                throw new ArgumentException(
                    "Check-out date must be after check-in date.");
            }

            Guest? guest = _guestRepository.GetById(booking.GuestId);

            if (guest == null)
            {
                throw new ArgumentException("The specified guest does not exist.");
            }

            Room? room = _roomRepository.GetById(booking.RoomId);

            if (room == null)
            {
                throw new ArgumentException("The specified room does not exist.");
            }

            bool overlapping = _bookingRepository.HasOverlappingBooking(
                booking.RoomId,
                booking.CheckInDate,
                booking.CheckOutDate);

            if (overlapping)
            {
                throw new InvalidOperationException("The room is already booked for the selected dates.");
            }

            booking.TotalBookingPrice = booking.CalculateBookingPrice(room.PricePerNight);

            booking.BookingStatus = BookingStatus.Confirmed;

            _bookingRepository.Create(booking);
        }

        public Booking? GetById(int bookingId)
        {
            return _bookingRepository.GetById(bookingId);
        }

        public List<Booking> GetAll()
        {
            return _bookingRepository.GetAllBookings();
        }

        public Booking Update(Booking booking)
        {
            Booking? existingBooking = _bookingRepository.GetById(booking.Id);

            if (existingBooking == null)
            {
                throw new KeyNotFoundException("The specified booking does not exist.");
            }

            if (existingBooking.BookingStatus == BookingStatus.Cancelled)
            {
                throw new InvalidOperationException("A cancelled booking cannot be updated.");
            }

            if (!booking.ValidateTime())
            {
                throw new ArgumentException("Check-out date must be after check-in date.");
            }

            Guest? guest = _guestRepository.GetById(booking.GuestId);

            if (guest == null)
            {
                throw new ArgumentException("The specified guest does not exist.");
            }

            Room? room = _roomRepository.GetById(booking.RoomId);

            if (room == null)
            {
                throw new ArgumentException("The specified room does not exist.");
            }

            

            bool overlapping = _bookingRepository.HasOverlappingBooking(
                    booking.RoomId,
                    booking.CheckInDate,
                    booking.CheckOutDate,
                    booking.Id);

            if (overlapping)
            {
                throw new InvalidOperationException("The room is already booked for the selected dates.");
            }

            existingBooking.GuestId = booking.GuestId;
            existingBooking.RoomId = booking.RoomId;
            existingBooking.CheckInDate = booking.CheckInDate;
            existingBooking.CheckOutDate = booking.CheckOutDate;
            existingBooking.TotalBookingPrice = booking.CalculateBookingPrice(room.PricePerNight);

            existingBooking.Guest = guest;
            existingBooking.Room = room;

            _bookingRepository.Update(existingBooking);

            return existingBooking;
        }

        public void Cancel(int bookingId)
        {
            Booking? booking =
                _bookingRepository.GetById(bookingId);

            if (booking == null)
            {
                throw new KeyNotFoundException("The specified booking does not exist.");
            }

            if (booking.BookingStatus == BookingStatus.Cancelled)
            {
                throw new InvalidOperationException("The booking is already cancelled.");
            }

            _bookingRepository.Cancel(bookingId);
        }
    }
}
