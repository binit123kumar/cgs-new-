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
    public class SliderController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileService _fileService;
        private const string Folder = "slider";

        public SliderController(ApplicationDbContext db, IFileService fileService)
        { _db = db; _fileService = fileService; }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(ApiResponse<List<SliderItem>>.Ok(await _db.SliderItems.OrderBy(x => x.DisplayOrder).ToListAsync()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _db.SliderItems.FindAsync(id);
            return item == null ? NotFound(ApiResponse<object>.Fail("Record not found.")) : Ok(ApiResponse<SliderItem>.Ok(item));
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> Create([FromForm] SliderFormDto dto)
        {
            if (dto.Image == null) return BadRequest(ApiResponse<object>.Fail("Image is required."));
            var entity = new SliderItem
            {
                Title = dto.Title, LinkUrl = dto.LinkUrl,
                DisplayOrder = dto.DisplayOrder, IsActive = dto.IsActive, CreatedAt = DateTime.UtcNow,
                ImagePath = await _fileService.SaveFileAsync(dto.Image, Folder)
            };
            _db.SliderItems.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<SliderItem>.Ok(entity, "Slide added successfully."));
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] SliderFormDto dto)
        {
            var entity = await _db.SliderItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.Title = dto.Title; entity.LinkUrl = dto.LinkUrl;
            entity.DisplayOrder = dto.DisplayOrder; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            if (dto.Image != null)
            {
                _fileService.DeleteFile(entity.ImagePath);
                entity.ImagePath = await _fileService.SaveFileAsync(dto.Image, Folder);
            }
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<SliderItem>.Ok(entity, "Slide updated successfully."));
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.SliderItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            _fileService.DeleteFile(entity.ImagePath);
            _db.SliderItems.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(null!, "Slide deleted successfully."));
        }

        [HttpPatch("{id}/toggle-status"), Authorize]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var entity = await _db.SliderItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.IsActive = !entity.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<SliderItem>.Ok(entity, "Status updated."));
        }
    }

    public class SliderFormDto
    {
        public string? Title { get; set; }
        public string? LinkUrl { get; set; }
        public int DisplayOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public IFormFile? Image { get; set; }
    }
}
