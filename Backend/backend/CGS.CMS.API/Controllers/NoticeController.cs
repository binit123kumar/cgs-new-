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
    public class NoticeController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileService _fileService;
        private const string Folder = "notice";

        public NoticeController(ApplicationDbContext db, IFileService fileService)
        { _db = db; _fileService = fileService; }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(ApiResponse<List<NoticeItem>>.Ok(await _db.NoticeItems.OrderBy(x => x.DisplayOrder).ToListAsync()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _db.NoticeItems.FindAsync(id);
            return item == null ? NotFound(ApiResponse<object>.Fail("Record not found.")) : Ok(ApiResponse<NoticeItem>.Ok(item));
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> Create([FromForm] NoticeFormDto dto)
        {
            var entity = new NoticeItem
            {
                Title = dto.Title, Description = dto.Description, NoticeDate = dto.NoticeDate,
                DisplayOrder = dto.DisplayOrder, IsActive = dto.IsActive, CreatedAt = DateTime.UtcNow
            };
            if (dto.File != null) entity.FilePath = await _fileService.SaveFileAsync(dto.File, Folder);
            _db.NoticeItems.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<NoticeItem>.Ok(entity, "Notice created successfully."));
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] NoticeFormDto dto)
        {
            var entity = await _db.NoticeItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.Title = dto.Title; entity.Description = dto.Description; entity.NoticeDate = dto.NoticeDate;
            entity.DisplayOrder = dto.DisplayOrder; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            if (dto.File != null)
            {
                _fileService.DeleteFile(entity.FilePath);
                entity.FilePath = await _fileService.SaveFileAsync(dto.File, Folder);
            }
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<NoticeItem>.Ok(entity, "Notice updated successfully."));
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.NoticeItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            _fileService.DeleteFile(entity.FilePath);
            _db.NoticeItems.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(null!, "Notice deleted successfully."));
        }

        [HttpPatch("{id}/toggle-status"), Authorize]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var entity = await _db.NoticeItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.IsActive = !entity.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<NoticeItem>.Ok(entity, "Status updated."));
        }
    }

    public class NoticeFormDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime NoticeDate { get; set; } = DateTime.UtcNow;
        public int DisplayOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public IFormFile? File { get; set; }
    }
}
