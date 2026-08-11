using HotelBooking.Application.Interfaces;
using HotelBooking.Entities;

namespace HotelBooking.Application.Services
{
    public class RoomService
    {
        private readonly IRoomRepository _roomRepository;

        public RoomService(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }

        public void Create(Room room)
        {
            ValidateRoom(room);

            if (_roomRepository.RoomNumberExists(room.RoomNumber))
            {
                throw new InvalidOperationException(
                    "A room with this room number already exists.");
            }

            _roomRepository.Create(room);
        }

        public Room? GetById(int roomId)
        {
            return _roomRepository.GetById(roomId);
        }

        public List<Room> GetAll()
        {
            return _roomRepository.GetAllRooms();
        }

        public void Update(Room room)
        {
            Room? existingRoom = _roomRepository.GetById(room.Id);

            if (existingRoom == null)
            {
                throw new KeyNotFoundException(
                    "The specified room does not exist.");
            }

            ValidateRoom(room);

            if (_roomRepository.RoomNumberExists(
                    room.RoomNumber,
                    room.Id))
            {
                throw new InvalidOperationException(
                    "A room with this room number already exists.");
            }

            _roomRepository.Update(room);
        }

        public void Delete(int roomId)
        {
            Room? room = _roomRepository.GetById(roomId);

            if (room == null)
            {
                throw new KeyNotFoundException(
                    "The specified room does not exist.");
            }

            _roomRepository.DeleteById(roomId);
        }

        private void ValidateRoom(Room room)
        {
            if (room.Capacity <= 0)
            {
                throw new ArgumentException(
                    "Room capacity must be greater than zero.");
            }

            if (room.PricePerNight <= 0)
            {
                throw new ArgumentException(
                    "Room price must be greater than zero.");
            }
        }
    }
}
