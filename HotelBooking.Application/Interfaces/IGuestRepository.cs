using HotelBooking.Entities;


namespace HotelBooking.Application.Interfaces
{
    public interface IGuestRepository
    {

        void Create(Guest guest);
        Guest? GetById(int guestId);
        List<Guest> GetAllGuests();
        void Update(Guest guest);
        void DeleteById(int guestId);
        bool GuestExists(string email, int? guestId = null);
    }
}
