using HotelBooking.Application.Interfaces;
using HotelBooking.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public User? GetById(int id)
        {
            return _context.Users
                .FirstOrDefault(user => user.Id == id);
        }

        public User? GetByUsername(string username)
        {
            return _context.Users
                .FirstOrDefault(user => user.Username == username);
        }

        public void Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public bool UsernameExists(string username, int? userId = null)
        {
            return _context.Users.Any(user =>
                user.Username == username &&
                (!userId.HasValue || user.Id != userId.Value));
        }
    }
}
