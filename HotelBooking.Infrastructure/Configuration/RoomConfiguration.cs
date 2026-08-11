using HotelBooking.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelBooking.Repositories.Configuration
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.HasKey(room => room.Id);

            builder.Property(room => room.RoomNumber)
                .IsRequired();

            builder.HasIndex(room => room.RoomNumber)
                .IsUnique();

            builder.Property(room => room.RoomType)
                .IsRequired();

            builder.Property(room => room.Capacity)
                .IsRequired();

            builder.Property(room => room.PricePerNight)
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(room => room.RoomStatus)
                .IsRequired();

            builder.HasMany(room => room.Bookings)
                .WithOne(booking => booking.Room)
                .HasForeignKey(booking => booking.RoomId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
