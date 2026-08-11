using HotelBooking.Application.Interfaces;
using HotelBooking.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class GuestRepository : IGuestRepository
    {
        private readonly AppDbContext _context;

        public GuestRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Create(Guest guest)
        {
            _context.Guests.Add(guest);
            _context.SaveChanges();
        }

        public Guest? GetById(int guestId)
        {
            return _context.Guests
                .FirstOrDefault(g => g.Id == guestId);
        }

        public List<Guest> GetAllGuests()
        {
            return _context.Guests
                .AsNoTracking()
                .ToList();
        }

        public void Update(Guest guest)
        {
            _context.Guests.Update(guest);
            _context.SaveChanges();
        }

        public void DeleteById(int guestId)
        {
            Guest? guest = _context.Guests
                .FirstOrDefault(g => g.Id == guestId);

            if (guest == null)
            {
                return;
            }

            _context.Guests.Remove(guest);
            _context.SaveChanges();
        }

        public bool GuestExists(string email, int? guestId = null)
        {
            return _context.Guests.Any(g =>
                g.Email == email &&
                (!guestId.HasValue || g.Id != guestId.Value));
        }
    }
}