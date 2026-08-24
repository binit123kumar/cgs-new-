using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CGS.CMS.API.Data;
using CGS.CMS.API.Helpers;
using CGS.CMS.API.Models;
using CGS.CMS.API.Services;

namespace CGS.CMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileService _fileService;
        private const string Folder = "events";

        public EventsController(ApplicationDbContext db, IFileService fileService)
        { _db = db; _fileService = fileService; }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(ApiResponse<List<EventItem>>.Ok(await _db.EventItems.OrderBy(x => x.DisplayOrder).ToListAsync()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _db.EventItems.FindAsync(id);
            return item == null ? NotFound(ApiResponse<object>.Fail("Record not found.")) : Ok(ApiResponse<EventItem>.Ok(item));
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> Create([FromForm] EventFormDto dto)
        {
            var entity = new EventItem
            {
                Title = dto.Title, Description = dto.Description, EventDate = dto.EventDate, Venue = dto.Venue,
                DisplayOrder = dto.DisplayOrder, IsActive = dto.IsActive, CreatedAt = DateTime.UtcNow
            };
            if (dto.Image != null) entity.ImagePath = await _fileService.SaveFileAsync(dto.Image, Folder);
            _db.EventItems.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<EventItem>.Ok(entity, "Event created successfully."));
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] EventFormDto dto)
        {
            var entity = await _db.EventItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.Title = dto.Title; entity.Description = dto.Description; entity.EventDate = dto.EventDate; entity.Venue = dto.Venue;
            entity.DisplayOrder = dto.DisplayOrder; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            if (dto.Image != null)
            {
                _fileService.DeleteFile(entity.ImagePath);
                entity.ImagePath = await _fileService.SaveFileAsync(dto.Image, Folder);
            }
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<EventItem>.Ok(entity, "Event updated successfully."));
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.EventItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            _fileService.DeleteFile(entity.ImagePath);
            _db.EventItems.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(null!, "Event deleted successfully."));
        }

        [HttpPatch("{id}/toggle-status"), Authorize]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var entity = await _db.EventItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.IsActive = !entity.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<EventItem>.Ok(entity, "Status updated."));
        }
    }

    public class EventFormDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime EventDate { get; set; } = DateTime.UtcNow;
        public string? Venue { get; set; }
        public int DisplayOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public IFormFile? Image { get; set; }
    }
}
