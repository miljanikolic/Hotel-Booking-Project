namespace HotelBooking.Entities
{
    public class Booking
    {
        public int Id { get; set; }
        public int GuestId { get; set; }        //foreign key
        public Guest Guest { get; set; }
        public int RoomId { get; set; }         //foreign key
        public Room Room { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal TotalBookingPrice { get; set; }
        public BookingStatus BookingStatus { get; set; }

        public bool ValidateTime()
        {
            return CheckOutDate > CheckInDate;

        }

        public decimal CalculateBookingPrice(decimal pricePerNight) 
        {
            int nights = (CheckOutDate - CheckInDate).Days;
            return nights * pricePerNight;
        }

        
    }
}
