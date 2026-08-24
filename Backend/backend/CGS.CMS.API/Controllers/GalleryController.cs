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
    public class GalleryController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileService _fileService;
        private const string Folder = "gallery";

        public GalleryController(ApplicationDbContext db, IFileService fileService)
        { _db = db; _fileService = fileService; }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(ApiResponse<List<GalleryItem>>.Ok(await _db.GalleryItems.OrderBy(x => x.Category).ThenBy(x => x.DisplayOrder).ToListAsync()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _db.GalleryItems.FindAsync(id);
            return item == null ? NotFound(ApiResponse<object>.Fail("Record not found.")) : Ok(ApiResponse<GalleryItem>.Ok(item));
        }

        // POST api/gallery
        // Accepts one or many photos at once ("images" field, repeated).
        // Each photo becomes its own GalleryItem in the same Category.
        // DisplayOrder auto-increments per category (continues from the
        // highest existing order in that category, so re-uploading more
        // photos into an existing album never collides with earlier ones).
        // Only one item per category can be IsPrimary (the category's cover
        // photo shown on the Home page) - setting a new one automatically
        // un-sets any previous primary in that same category.
        [HttpPost, Authorize]
        public async Task<IActionResult> Create([FromForm] GalleryFormDto dto)
        {
            var files = (dto.Images != null && dto.Images.Count > 0)
                ? dto.Images
                : (dto.Image != null ? new List<IFormFile> { dto.Image } : new List<IFormFile>());

            if (files.Count == 0)
                return BadRequest(ApiResponse<object>.Fail("At least one image is required."));

            var category = dto.Category?.Trim() ?? string.Empty;

            // Find the last-used DisplayOrder within this category so new
            // photos append after it instead of starting back at 1.
            var lastOrder = await _db.GalleryItems
                .Where(g => g.Category == category)
                .Select(g => (int?)g.DisplayOrder)
                .MaxAsync() ?? 0;

            if (dto.IsPrimary)
            {
                // Un-set any existing primary photo in this category -
                // only one cover image per category at a time.
                var existingPrimaries = await _db.GalleryItems
                    .Where(g => g.Category == category && g.IsPrimary)
                    .ToListAsync();
                foreach (var p in existingPrimaries) p.IsPrimary = false;
            }

            var created = new List<GalleryItem>();
            for (int i = 0; i < files.Count; i++)
            {
                lastOrder++;
                var entity = new GalleryItem
                {
                    Title = dto.Title,
                    Category = category,
                    DisplayOrder = lastOrder,
                    IsActive = dto.IsActive,
                    // Only the FIRST photo in this batch becomes the category
                    // cover, even if several photos are uploaded together.
                    IsPrimary = dto.IsPrimary && i == 0,
                    CreatedAt = DateTime.UtcNow,
                    ImagePath = await _fileService.SaveFileAsync(files[i], Folder)
                };
                _db.GalleryItems.Add(entity);
                created.Add(entity);
            }

            await _db.SaveChangesAsync();
            return Ok(ApiResponse<List<GalleryItem>>.Ok(created, $"{created.Count} photo(s) uploaded successfully."));
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] GalleryFormDto dto)
        {
            var entity = await _db.GalleryItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));

            var category = dto.Category?.Trim() ?? string.Empty;
            entity.Title = dto.Title; entity.Category = category;
            entity.DisplayOrder = dto.DisplayOrder; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;

            if (dto.IsPrimary && !entity.IsPrimary)
            {
                var existingPrimaries = await _db.GalleryItems
                    .Where(g => g.Category == category && g.IsPrimary && g.Id != id)
                    .ToListAsync();
                foreach (var p in existingPrimaries) p.IsPrimary = false;
            }
            entity.IsPrimary = dto.IsPrimary;

            // Update supports replacing this single photo (first file only).
            var newFile = (dto.Images != null && dto.Images.Count > 0) ? dto.Images[0] : dto.Image;
            if (newFile != null)
            {
                _fileService.DeleteFile(entity.ImagePath);
                entity.ImagePath = await _fileService.SaveFileAsync(newFile, Folder);
            }
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<GalleryItem>.Ok(entity, "Gallery image updated successfully."));
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.GalleryItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            _fileService.DeleteFile(entity.ImagePath);
            _db.GalleryItems.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(null!, "Gallery image deleted successfully."));
        }

        [HttpPatch("{id}/toggle-status"), Authorize]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var entity = await _db.GalleryItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.IsActive = !entity.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<GalleryItem>.Ok(entity, "Status updated."));
        }
    }

    public class GalleryFormDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Category { get; set; }
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public IFormFile? Image { get; set; }
        public List<IFormFile>? Images { get; set; }
    }
}