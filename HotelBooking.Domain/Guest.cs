using System.Net.Mail;

namespace HotelBooking.Entities
{
    public class Guest
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();


        public string GetFullName()
        {
            return FirstName + " " + LastName;
        }

        public bool IsEmailValid()
        {
            try
            {
                MailAddress m = new MailAddress(Email);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }



    }
}
