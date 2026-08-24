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
    public class DownloadsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileService _fileService;
        private const string Folder = "downloads";

        public DownloadsController(ApplicationDbContext db, IFileService fileService)
        { _db = db; _fileService = fileService; }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(ApiResponse<List<DownloadItem>>.Ok(await _db.DownloadItems.OrderBy(x => x.DisplayOrder).ToListAsync()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _db.DownloadItems.FindAsync(id);
            return item == null ? NotFound(ApiResponse<object>.Fail("Record not found.")) : Ok(ApiResponse<DownloadItem>.Ok(item));
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> Create([FromForm] DownloadFormDto dto)
        {
            if (dto.File == null) return BadRequest(ApiResponse<object>.Fail("File is required."));
            var entity = new DownloadItem
            {
                Title = dto.Title, Category = dto.Category,
                DisplayOrder = dto.DisplayOrder, IsActive = dto.IsActive, CreatedAt = DateTime.UtcNow,
                FilePath = await _fileService.SaveFileAsync(dto.File, Folder)
            };
            _db.DownloadItems.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<DownloadItem>.Ok(entity, "Download added successfully."));
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] DownloadFormDto dto)
        {
            var entity = await _db.DownloadItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.Title = dto.Title; entity.Category = dto.Category;
            entity.DisplayOrder = dto.DisplayOrder; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            if (dto.File != null)
            {
                _fileService.DeleteFile(entity.FilePath);
                entity.FilePath = await _fileService.SaveFileAsync(dto.File, Folder);
            }
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<DownloadItem>.Ok(entity, "Download updated successfully."));
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.DownloadItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            _fileService.DeleteFile(entity.FilePath);
            _db.DownloadItems.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(null!, "Download deleted successfully."));
        }

        [HttpPatch("{id}/toggle-status"), Authorize]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var entity = await _db.DownloadItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.IsActive = !entity.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<DownloadItem>.Ok(entity, "Status updated."));
        }
    }

    public class DownloadFormDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Category { get; set; }
        public int DisplayOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public IFormFile? File { get; set; }
    }
}
