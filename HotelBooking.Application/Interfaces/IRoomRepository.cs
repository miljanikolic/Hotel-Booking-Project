using HotelBooking.Entities;

namespace HotelBooking.Application.Interfaces
{
    public interface IRoomRepository
    {

        void Create(Room room);
        Room? GetById(int roomNumber);
        List<Room> GetAllRooms();
        void Update(Room room);
        void DeleteById(int roomId);
        bool RoomNumberExists(int roomNumber, int? roomId = null);

    }
}
