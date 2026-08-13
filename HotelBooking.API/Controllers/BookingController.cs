using HotelBooking.Application.DTOs.Bookings;
using HotelBooking.Application.Services;
using HotelBooking.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.API.Controllers
{
    [Authorize(Roles = "Admin,Staff")]
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;
        public BookingController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }
        [HttpGet]
        public ActionResult<BookingResponse> GetAll()
        {
            List<Booking?> bookings = _bookingService.GetAll();
            List<BookingResponse> response = bookings
                .Select(MapToResponse)
                .ToList();

            return Ok(response);
        }

        [HttpGet("{id}")]
        public ActionResult<BookingResponse> GetBookingById(int id)
        {
            Booking? booking = _bookingService.GetById(id);

            if (booking == null)
            {
                return NotFound(new {message = "The specified booking does not exist."});
            }

            return Ok(MapToResponse(booking));
        }
        [HttpPost]
        public ActionResult<BookingResponse> Create(CreateBookingRequest request)
        {
            try
            {
                Booking booking = new Booking
                {
                    GuestId = request.GuestId,
                    RoomId = request.RoomId,
                    CheckInDate = request.CheckInDate,
                    CheckOutDate = request.CheckOutDate
                };
                _bookingService.Create(booking);
                BookingResponse response = MapToResponse(booking);
                return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        public ActionResult<BookingResponse> Update(int id, UpdateBookingRequest request)
        {
            try
            {
                Booking booking = new Booking
                {
                    Id = id,
                    GuestId = request.GuestId,
                    RoomId = request.RoomId,
                    CheckInDate = request.CheckInDate,
                    CheckOutDate = request.CheckOutDate
                };
                Booking updatedBooking = _bookingService.Update(booking);
                return Ok(MapToResponse(updatedBooking));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/cancel")]
        public ActionResult<BookingResponse> Cancel(int id)
        {
            try
            {
                _bookingService.Cancel(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private static BookingResponse MapToResponse(Booking booking)
        {
            return new BookingResponse
            {
                Id = booking.Id,
                GuestId = booking.GuestId,
                GuestName = $"{booking.Guest.FirstName} {booking.Guest.LastName}",
                RoomId = booking.RoomId,
                RoomNumber = booking.Room.RoomNumber,
                CheckInDate = booking.CheckInDate,
                CheckOutDate = booking.CheckOutDate,
                TotalBookingPrice = booking.TotalBookingPrice,
                BookingStatus = booking.BookingStatus
            };
        }
    }
}
