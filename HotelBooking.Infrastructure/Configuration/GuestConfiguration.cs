using HotelBooking.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelBooking.Repositories.Configuration
{
    public class GuestConfiguration : IEntityTypeConfiguration<Guest>
    {
        public void Configure(EntityTypeBuilder<Guest> builder)
        {
            builder.HasKey(guest => guest.Id);

            builder.Property(guest => guest.FirstName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(guest => guest.LastName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(guest => guest.Email)
                .IsRequired()
                .HasMaxLength(255);

            builder.HasIndex(guest => guest.Email)
                .IsUnique();

            builder.Property(guest => guest.PhoneNumber)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasMany(guest => guest.Bookings)
                .WithOne(booking => booking.Guest)
                .HasForeignKey(booking => booking.GuestId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
