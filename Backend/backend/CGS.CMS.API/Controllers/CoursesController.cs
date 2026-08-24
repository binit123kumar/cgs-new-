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
    public class CoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileService _fileService;
        private const string Folder = "courses";

        public CoursesController(ApplicationDbContext db, IFileService fileService)
        { _db = db; _fileService = fileService; }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(ApiResponse<List<Course>>.Ok(await _db.Courses.OrderBy(x => x.DisplayOrder).ToListAsync()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _db.Courses.FindAsync(id);
            return item == null ? NotFound(ApiResponse<object>.Fail("Record not found.")) : Ok(ApiResponse<Course>.Ok(item));
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> Create([FromForm] CourseFormDto dto)
        {
            var entity = new Course
            {
                Name = dto.Name,
                Description = dto.Description,
                Duration = dto.Duration,
                Eligibility = dto.Eligibility,
                DisplayOrder = dto.DisplayOrder,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };
            if (dto.Image != null) entity.ImagePath = await _fileService.SaveFileAsync(dto.Image, Folder);
            if (dto.Pdf != null) entity.PdfPath = await _fileService.SaveFileAsync(dto.Pdf, Folder);
            _db.Courses.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<Course>.Ok(entity, "Course created successfully."));
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] CourseFormDto dto)
        {
            var entity = await _db.Courses.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.Name = dto.Name; entity.Description = dto.Description; entity.Duration = dto.Duration; entity.Eligibility = dto.Eligibility;
            entity.DisplayOrder = dto.DisplayOrder; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            if (dto.Image != null)
            {
                _fileService.DeleteFile(entity.ImagePath);
                entity.ImagePath = await _fileService.SaveFileAsync(dto.Image, Folder);
            }
            if (dto.Pdf != null)
            {
                _fileService.DeleteFile(entity.PdfPath);
                entity.PdfPath = await _fileService.SaveFileAsync(dto.Pdf, Folder);
            }
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<Course>.Ok(entity, "Course updated successfully."));
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.Courses.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            _fileService.DeleteFile(entity.ImagePath);
            _fileService.DeleteFile(entity.PdfPath);
            _db.Courses.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(null!, "Course deleted successfully."));
        }

        [HttpPatch("{id}/toggle-status"), Authorize]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var entity = await _db.Courses.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.IsActive = !entity.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<Course>.Ok(entity, "Status updated."));
        }
    }

    public class CourseFormDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Duration { get; set; }
        public string? Eligibility { get; set; }
        public int DisplayOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public IFormFile? Image { get; set; }
        public IFormFile? Pdf { get; set; }
    }
}