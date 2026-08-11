using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using HotelBooking.Application.Interfaces;
using HotelBooking.Infrastructure.Repositories;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IGuestRepository, GuestRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
