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
    public class NewsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileService _fileService;
        private const string Folder = "news";

        public NewsController(ApplicationDbContext db, IFileService fileService)
        { _db = db; _fileService = fileService; }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(ApiResponse<List<NewsItem>>.Ok(await _db.NewsItems.OrderBy(x => x.DisplayOrder).ToListAsync()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _db.NewsItems.FindAsync(id);
            return item == null ? NotFound(ApiResponse<object>.Fail("Record not found.")) : Ok(ApiResponse<NewsItem>.Ok(item));
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> Create([FromForm] NewsFormDto dto)
        {
            var entity = new NewsItem
            {
                Title = dto.Title,
                Description = dto.Description,
                PublishDate = dto.PublishDate,
                LinkUrl = dto.LinkUrl,
                DisplayOrder = dto.DisplayOrder,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };
            if (dto.Image != null) entity.ImagePath = await _fileService.SaveFileAsync(dto.Image, Folder);
            _db.NewsItems.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<NewsItem>.Ok(entity, "News created successfully."));
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] NewsFormDto dto)
        {
            var entity = await _db.NewsItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.Title = dto.Title; entity.Description = dto.Description; entity.PublishDate = dto.PublishDate; entity.LinkUrl = dto.LinkUrl;
            entity.DisplayOrder = dto.DisplayOrder; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            if (dto.Image != null)
            {
                _fileService.DeleteFile(entity.ImagePath);
                entity.ImagePath = await _fileService.SaveFileAsync(dto.Image, Folder);
            }
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<NewsItem>.Ok(entity, "News updated successfully."));
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.NewsItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            _fileService.DeleteFile(entity.ImagePath);
            _db.NewsItems.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(null!, "News deleted successfully."));
        }

        [HttpPatch("{id}/toggle-status"), Authorize]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var entity = await _db.NewsItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.IsActive = !entity.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<NewsItem>.Ok(entity, "Status updated."));
        }
    }

    public class NewsFormDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? LinkUrl { get; set; }
        public DateTime PublishDate { get; set; } = DateTime.UtcNow;
        public int DisplayOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public IFormFile? Image { get; set; }
    }
}