using System.Text.Json;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CGS.CMS.API.Data;
using CGS.CMS.API.Helpers;
using CGS.CMS.API.Models;

namespace CGS.CMS.API.Controllers
{
    [ApiController]
    [Route("api/admin-users")]
    [Authorize]
    public class AdminUsersController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public AdminUsersController(ApplicationDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _db.AdminUsers.OrderBy(x => x.Username).ToListAsync();
            return Ok(ApiResponse<List<AdminUserDto>>.Ok(users.Select(ToDto).ToList()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AdminUserFormDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(ApiResponse<object>.Fail("Username and password are required."));
            if (await _db.AdminUsers.AnyAsync(x => x.Username == dto.Username.Trim()))
                return Conflict(ApiResponse<object>.Fail("Username already exists."));

            var user = new AdminUser
            {
                Username = dto.Username.Trim(), FullName = dto.FullName?.Trim() ?? string.Empty,
                Email = dto.Email?.Trim(), Role = dto.Role?.Trim() ?? "Editor",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password), PermissionsJson = JsonSerializer.Serialize(dto.Permissions ?? new()),
            };
            _db.AdminUsers.Add(user);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<AdminUserDto>.Ok(ToDto(user), "Admin user created."));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AdminUserFormDto dto)
        {
            var user = await _db.AdminUsers.FindAsync(id);
            if (user == null) return NotFound(ApiResponse<object>.Fail("Admin user not found."));
            if (user.Id == 1 && !string.Equals(dto.Role, "Super Admin", StringComparison.OrdinalIgnoreCase))
                return BadRequest(ApiResponse<object>.Fail("The primary Super Admin cannot be downgraded."));
            user.FullName = dto.FullName?.Trim() ?? string.Empty; user.Email = dto.Email?.Trim(); user.Role = dto.Role?.Trim() ?? user.Role;
            user.PermissionsJson = JsonSerializer.Serialize(dto.Permissions ?? new());
            if (!string.IsNullOrWhiteSpace(dto.Password)) user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<AdminUserDto>.Ok(ToDto(user), "Admin user updated."));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id == 1) return BadRequest(ApiResponse<object>.Fail("The primary Super Admin cannot be deleted."));
            var user = await _db.AdminUsers.FindAsync(id);
            if (user == null) return NotFound(ApiResponse<object>.Fail("Admin user not found."));
            _db.AdminUsers.Remove(user); await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(null!, "Admin user deleted."));
        }

        private static AdminUserDto ToDto(AdminUser user) => new()
        { Id = user.Id, Username = user.Username, FullName = user.FullName, Email = user.Email, Role = user.Role,
          Permissions = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(user.PermissionsJson ?? "{}") ?? new(), LastLogin = user.LastLogin };
    }

    public class AdminUserFormDto
    {
        public string Username { get; set; } = string.Empty; public string? Password { get; set; }
        public string? FullName { get; set; } public string? Email { get; set; } public string? Role { get; set; }
        public Dictionary<string, List<string>>? Permissions { get; set; }
    }
    public class AdminUserDto
    {
        public int Id { get; set; } public string Username { get; set; } = string.Empty; public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; } public string Role { get; set; } = string.Empty;
        public Dictionary<string, List<string>> Permissions { get; set; } = new(); public DateTime? LastLogin { get; set; }
    }
}