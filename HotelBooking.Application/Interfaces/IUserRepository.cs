using HotelBooking.Entities;

namespace HotelBooking.Application.Interfaces
{
    public interface IUserRepository
    {
        User? GetById(int id);
        User? GetByUsername(string username);
        void Add(User user);
        bool UsernameExists(string username, int? userId = null);
    }
}
