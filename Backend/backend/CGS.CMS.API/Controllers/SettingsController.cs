using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CGS.CMS.API.Data;
using CGS.CMS.API.Helpers;
using CGS.CMS.API.Models;
using CGS.CMS.API.Services;

namespace CGS.CMS.API.Controllers
{
    // Settings is a single row (site-wide config), not a list like the other modules.
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileService _fileService;
        private const string Folder = "settings";

        public SettingsController(ApplicationDbContext db, IFileService fileService)
        { _db = db; _fileService = fileService; }

        // GET api/settings
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var settings = await _db.SiteSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new SiteSetting { SiteName = "CGS" };
                _db.SiteSettings.Add(settings);
                await _db.SaveChangesAsync();
            }
            return Ok(ApiResponse<SiteSetting>.Ok(settings));
        }

        // PUT api/settings  (multipart/form-data, updates the single settings row)
        [HttpPut, Authorize]
        public async Task<IActionResult> Update([FromForm] SettingsFormDto dto)
        {
            var settings = await _db.SiteSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new SiteSetting();
                _db.SiteSettings.Add(settings);
            }

            settings.SiteName = dto.SiteName;
            settings.Address = dto.Address;
            settings.Phone = dto.Phone;
            settings.Email = dto.Email;
            settings.Facebook = dto.Facebook;
            settings.Twitter = dto.Twitter;
            settings.Instagram = dto.Instagram;
            settings.YouTube = dto.YouTube;
            settings.MetaTitle = dto.MetaTitle;
            settings.MetaDescription = dto.MetaDescription;
            settings.UpdatedAt = DateTime.UtcNow;

            if (dto.Logo != null)
            {
                _fileService.DeleteFile(settings.LogoPath);
                settings.LogoPath = await _fileService.SaveFileAsync(dto.Logo, Folder);
            }

            if (dto.UniversityLogo != null)
            {
                _fileService.DeleteFile(settings.UniversityLogoPath);
                settings.UniversityLogoPath = await _fileService.SaveFileAsync(dto.UniversityLogo, Folder);
            }

            await _db.SaveChangesAsync();
            return Ok(ApiResponse<SiteSetting>.Ok(settings, "Settings updated successfully."));
        }
    }

    public class SettingsFormDto
    {
        public string SiteName { get; set; } = "CGS";
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Facebook { get; set; }
        public string? Twitter { get; set; }
        public string? Instagram { get; set; }
        public string? YouTube { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public IFormFile? Logo { get; set; }
        public IFormFile? UniversityLogo { get; set; }
    }
}