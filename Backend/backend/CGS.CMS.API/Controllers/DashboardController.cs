using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CGS.CMS.API.Data;
using CGS.CMS.API.DTOs;
using CGS.CMS.API.Helpers;

namespace CGS.CMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public DashboardController(ApplicationDbContext db) => _db = db;

        // GET api/dashboard/counts -> feeds the number badges on each card in the dashboard
        [HttpGet("counts")]
        public async Task<IActionResult> GetCounts()
        {
            var counts = new DashboardCountsDto
            {
                About = await _db.Abouts.CountAsync(x => x.IsActive),
                Faculty = await _db.Faculties.CountAsync(x => x.IsActive),
                Staff = await _db.Staffs.CountAsync(x => x.IsActive),
                Gallery = await _db.GalleryItems.CountAsync(x => x.IsActive),
                News = await _db.NewsItems.CountAsync(x => x.IsActive),
                Events = await _db.EventItems.CountAsync(x => x.IsActive),
                Notice = await _db.NoticeItems.CountAsync(x => x.IsActive),
                Slider = await _db.SliderItems.CountAsync(x => x.IsActive),
                Courses = await _db.Courses.CountAsync(x => x.IsActive),
                Downloads = await _db.DownloadItems.CountAsync(x => x.IsActive),
                Publications = await _db.Publications.CountAsync(x => x.IsActive),
                AimObjective = await _db.AimObjectiveItems.CountAsync(x => x.IsActive)
            };

            return Ok(ApiResponse<DashboardCountsDto>.Ok(counts));
        }
    }
}