using HotelBooking.Application.DTOs.Rooms;
using HotelBooking.Application.Services;
using HotelBooking.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Net.NetworkInformation;

namespace HotelBooking.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly RoomService _roomService;
        public RoomController(RoomService roomService)
        {
            _roomService = roomService;
        }

        // GET: api/Room
        [HttpGet]
        public ActionResult<List<RoomResponse>> GetAll()
        {
            List<Room> rooms = _roomService.GetAll();
            List<RoomResponse> response = rooms
                .Select(MapToResponse)
                .ToList();
            return Ok(response);
        }

        // GET: api/Room/1
        [HttpGet("{id}")]
        public ActionResult<RoomResponse> GetById(int id)
        {
            Room? room = _roomService.GetById(id);
            if (room == null)
            {
                return NotFound(new { message = "The specified room does not exist." });
            }
            return Ok(MapToResponse(room));
        }
        // POST: api/Room
        [HttpPost]
        public ActionResult<RoomResponse> Create(
            CreateRoomRequest request)
        {
            try
            {
                Room room = new Room
                {
                    RoomNumber = request.RoomNumber,
                    RoomType = request.RoomType,
                    Capacity = request.Capacity,
                    PricePerNight = request.PricePerNight,
                    RoomStatus = request.RoomStatus
                };
                _roomService.Create(room);
                RoomResponse response = MapToResponse(room);
                return CreatedAtAction(nameof(GetById), new { id = room.Id }, response);
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
        // PUT: api/Room/1
        [HttpPut("{id}")]
        public ActionResult<RoomResponse> Update(int id, UpdateRoomRequest request)
        {
            try
            {
                Room? room = _roomService.GetById(id);
                if (room == null)
                {
                    return NotFound(new { message = "The specified room does not exist." });
                }

                room.RoomNumber = request.RoomNumber;
                room.RoomType = request.RoomType;
                room.Capacity = request.Capacity;
                room.PricePerNight = request.PricePerNight;
                room.RoomStatus = request.RoomStatus;

                _roomService.Update(room);
                RoomResponse response = MapToResponse(room);
                return Ok(response);
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
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _roomService.Delete(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        private static RoomResponse MapToResponse(Room room)
        {
            return new RoomResponse
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                RoomType = room.RoomType,
                Capacity = room.Capacity,
                PricePerNight = room.PricePerNight,
                RoomStatus = room.RoomStatus
            };
        }
    }

}
    

