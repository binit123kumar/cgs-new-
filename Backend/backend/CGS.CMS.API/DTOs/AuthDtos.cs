using System.ComponentModel.DataAnnotations;

namespace CGS.CMS.API.DTOs
{
    public class LoginRequestDto
    {
        [Required] public string Username { get; set; } = string.Empty;
        [Required] public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public Dictionary<string, List<string>> Permissions { get; set; } = new();
        public DateTime ExpiresAt { get; set; }
    }

    public class DashboardCountsDto
    {
        public int About { get; set; }
        public int Faculty { get; set; }
        public int Staff { get; set; }
        public int Gallery { get; set; }
        public int News { get; set; }
        public int Events { get; set; }
        public int Notice { get; set; }
        public int Slider { get; set; }
        public int Courses { get; set; }
        public int Downloads { get; set; }
        public int Publications { get; set; }
        public int AimObjective { get; set; }
    }
}