using HotelBooking.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HotelBooking.Infrastructure.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(user => user.Id);

            builder.Property(user => user.Username)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(user => user.Username)
                .IsUnique();

            builder.Property(user => user.PasswordHash)
                .IsRequired();

            builder.Property(user => user.Role)
                .IsRequired();

            builder.Property(user => user.IsActive)
                .HasDefaultValue(true)
                .IsRequired();

            builder.Property(user => user.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .IsRequired();
        }
    }
}
