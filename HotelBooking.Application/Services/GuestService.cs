using HotelBooking.Application.Interfaces;
using HotelBooking.Entities;

namespace HotelBooking.Application.Services
{
    public class GuestService
    {
        private readonly IGuestRepository _guestRepository;

        public GuestService(IGuestRepository guestRepository)
        {
            _guestRepository = guestRepository;
        }

        public void Create(Guest guest)
        {
            if (!guest.IsEmailValid())
            {
                throw new ArgumentException(
                    "The email address is not valid.");
            }

            if (_guestRepository.GuestExists(guest.Email))
            {
                throw new InvalidOperationException(
                    "A guest with this email address already exists.");
            }

            _guestRepository.Create(guest);
        }

        public Guest? GetById(int guestId)
        {
            return _guestRepository.GetById(guestId);
        }

        public List<Guest> GetAll()
        {
            return _guestRepository.GetAllGuests();
        }

        public void Update(Guest guest)
        {
            Guest? existingGuest = _guestRepository.GetById(guest.Id);

            if (existingGuest == null)
            {
                throw new KeyNotFoundException(
                    "The specified guest does not exist.");
            }

            if (!guest.IsEmailValid())
            {
                throw new ArgumentException(
                    "The email address is not valid.");
            }

            if (_guestRepository.GuestExists(
                    guest.Email,
                    guest.Id))
            {
                throw new InvalidOperationException(
                    "A guest with this email address already exists.");
            }

            _guestRepository.Update(guest);
        }

        public void Delete(int guestId)
        {
            Guest? guest = _guestRepository.GetById(guestId);

            if (guest == null)
            {
                throw new KeyNotFoundException(
                    "The specified guest does not exist.");
            }

            _guestRepository.DeleteById(guestId);
        }
    }
}