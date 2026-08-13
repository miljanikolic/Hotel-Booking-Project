using HotelBooking.Application.DTOs.Guests;
using HotelBooking.Application.Services;
using HotelBooking.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.API.Controllers
{
    [Authorize(Roles = "Admin,Staff")]
    [ApiController]
    [Route("api/[controller]")]
    public class GuestController : ControllerBase
    {
        private readonly GuestService _guestService;

        public GuestController(GuestService guestService)
        {
            _guestService = guestService;
        }

        // GET: api/Guest
        [HttpGet]
        public ActionResult<List<GuestResponse>> GetAll()
        {
            List<Guest> guests = _guestService.GetAll();

            List<GuestResponse> response = guests
                .Select(MapToResponse)
                .ToList();

            return Ok(response);
        }

        // GET: api/Guest/5
        [HttpGet("{id}")]
        public ActionResult<GuestResponse> GetById(int id)
        {
            Guest? guest = _guestService.GetById(id);

            if (guest == null)
            {
                return NotFound(new
                {
                    message = "The specified guest does not exist."
                });
            }

            return Ok(MapToResponse(guest));
        }

        // POST: api/Guest
        [HttpPost]
        public ActionResult<GuestResponse> Create(
            CreateGuestRequest request)
        {
            try
            {
                Guest guest = new Guest
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    PhoneNumber = request.PhoneNumber
                };

                _guestService.Create(guest);

                GuestResponse response = MapToResponse(guest);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = guest.Id },
                    response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }

        
        [HttpPut("{id}")]
        public ActionResult<GuestResponse> Update(int id, UpdateGuestRequest request)
        {
            try
            {
                Guest guest = new Guest
                {
                    Id = id,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    PhoneNumber = request.PhoneNumber
                };

                Guest updatedGuest = _guestService.Update(guest);

                return Ok(MapToResponse(updatedGuest));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }

      
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _guestService.Delete(id);

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
        }

        private static GuestResponse MapToResponse(Guest guest)
        {
            return new GuestResponse
            {
                Id = guest.Id,
                FirstName = guest.FirstName,
                LastName = guest.LastName,
                Email = guest.Email,
                PhoneNumber = guest.PhoneNumber
            };
        }
    }
}