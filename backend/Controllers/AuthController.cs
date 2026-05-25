using JobTracker.DTOs;
using JobTracker.Models;
using JobTracker.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            this._authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.Login(request.Email, request.Password);
            if (token == null) return Unauthorized(new {message = "Invalid email or password"});
            return Ok(new { Token = token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = new User
            {
                Name = request.Name,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = request.Password
            };
            var token = await _authService.Register(user);
            if (token == null) return BadRequest(new {message = "Email already in use"});
            return Ok(new { Token = token });
        }
    }
}