using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CGS.CMS.API.Data;
using CGS.CMS.API.DTOs;
using CGS.CMS.API.Helpers;
using CGS.CMS.API.Services;
using System.Text.Json;

namespace CGS.CMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly ITokenService _tokenService;

        public AuthController(ApplicationDbContext db, ITokenService tokenService)
        {
            _db = db;
            _tokenService = tokenService;
        }

        // POST api/auth/login
        // Default seeded user -> username: admin, password: Admin@123
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var user = await _db.AdminUsers.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(ApiResponse<object>.Fail("Invalid username or password."));

            var (token, expiresAt) = _tokenService.GenerateToken(user);

            user.LastLogin = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            var response = new LoginResponseDto
            {
                Token = token,
                Username = user.Username,
                FullName = user.FullName,
                Role = user.Role,
                Permissions = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(user.PermissionsJson ?? "{}") ?? new(),
                ExpiresAt = expiresAt
            };

            return Ok(ApiResponse<LoginResponseDto>.Ok(response, "Login successful."));
        }
    }
}
