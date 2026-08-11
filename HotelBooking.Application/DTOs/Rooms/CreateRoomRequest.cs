using HotelBooking.Entities;

namespace HotelBooking.Application.DTOs.Rooms
{
    public class CreateRoomRequest
    {
        public int RoomNumber { get; set; }
        public RoomType RoomType { get; set; }
        public int Capacity { get; set; }
        public decimal PricePerNight { get; set; }
        public RoomStatus RoomStatus { get; set; }
    }
}
