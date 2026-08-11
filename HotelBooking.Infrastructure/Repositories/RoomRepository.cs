using HotelBooking.Application.Interfaces;
using HotelBooking.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly AppDbContext _context;

        public RoomRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Create(Room room)
        {
            _context.Rooms.Add(room);
            _context.SaveChanges();
        }

        public Room? GetById(int roomId)
        {
            return _context.Rooms
                .FirstOrDefault(r => r.Id == roomId);
        }

        public List<Room> GetAllRooms()
        {
            return _context.Rooms
                .AsNoTracking()
                .ToList();
        }

        public void Update(Room room)
        {
            _context.Rooms.Update(room);
            _context.SaveChanges();
        }

        public void DeleteById(int roomId)
        {
            Room? room = _context.Rooms
                .FirstOrDefault(r => r.Id == roomId);

            if (room == null)
            {
                return;
            }

            _context.Rooms.Remove(room);
            _context.SaveChanges();
        }

        public bool RoomNumberExists(int roomNumber, int? roomId = null)
        {
            return _context.Rooms.Any(r =>
                r.RoomNumber == roomNumber &&
                (!roomId.HasValue || r.Id != roomId.Value));
        }
    }
}