using HotelBooking.Application.DTOs.Auth;
using HotelBooking.Application.Interfaces;
using HotelBooking.Entities;
using BCrypt.Net;

namespace HotelBooking.Application.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly TokenService _tokenService;

        public AuthService(IUserRepository userRepository, TokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        public AuthResponse Login(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Username and password are required."
                };
            }

            User? user = _userRepository.GetByUsername(request.Username.Trim());

            if (user == null || !user.IsActive || !global::BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Invalid username or password."
                };
            }

            var token = _tokenService.GenerateToken(user);

            return new AuthResponse
            {
                Success = true,
                Message = "Login successful.",
                Token = token,
                User = new User
                {
                    Id = user.Id,
                    Username = user.Username,
                    Role = user.Role,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt
                }
            };
        }
    }
}
