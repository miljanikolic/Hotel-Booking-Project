using HotelBooking.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelBooking.Repositories.Configuration
{
    public class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            builder.HasKey(booking => booking.Id);

            builder.Property(booking => booking.CheckInDate)
                .IsRequired();

            builder.Property(booking => booking.CheckOutDate)
                .IsRequired();

            builder.Property(booking => booking.TotalBookingPrice)
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(booking => booking.BookingStatus)
                .IsRequired();

            builder.HasOne(booking => booking.Guest)
                .WithMany(guest => guest.Bookings)
                .HasForeignKey(booking => booking.GuestId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(booking => booking.Room)
                .WithMany(room => room.Bookings)
                .HasForeignKey(booking => booking.RoomId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
