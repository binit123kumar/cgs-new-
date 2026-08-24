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
    public class FacultyController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileService _fileService;
        private const string Folder = "faculty";

        public FacultyController(ApplicationDbContext db, IFileService fileService)
        { _db = db; _fileService = fileService; }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(ApiResponse<List<Faculty>>.Ok(await _db.Faculties.OrderBy(x => x.DisplayOrder).ToListAsync()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _db.Faculties.FindAsync(id);
            return item == null ? NotFound(ApiResponse<object>.Fail("Record not found.")) : Ok(ApiResponse<Faculty>.Ok(item));
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> Create([FromForm] FacultyFormDto dto)
        {
            var entity = new Faculty
            {
                Name = dto.Name, Designation = dto.Designation, Qualification = dto.Qualification,
                Email = dto.Email, Phone = dto.Phone, Bio = dto.Bio,
                DisplayOrder = dto.DisplayOrder, IsActive = dto.IsActive, CreatedAt = DateTime.UtcNow
            };
            if (dto.Photo != null) entity.PhotoPath = await _fileService.SaveFileAsync(dto.Photo, Folder);
            _db.Faculties.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<Faculty>.Ok(entity, "Faculty created successfully."));
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] FacultyFormDto dto)
        {
            var entity = await _db.Faculties.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.Name = dto.Name; entity.Designation = dto.Designation; entity.Qualification = dto.Qualification;
            entity.Email = dto.Email; entity.Phone = dto.Phone; entity.Bio = dto.Bio;
            entity.DisplayOrder = dto.DisplayOrder; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            if (dto.Photo != null)
            {
                _fileService.DeleteFile(entity.PhotoPath);
                entity.PhotoPath = await _fileService.SaveFileAsync(dto.Photo, Folder);
            }
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<Faculty>.Ok(entity, "Faculty updated successfully."));
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.Faculties.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            _fileService.DeleteFile(entity.PhotoPath);
            _db.Faculties.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(null!, "Faculty deleted successfully."));
        }

        [HttpPatch("{id}/toggle-status"), Authorize]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var entity = await _db.Faculties.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.IsActive = !entity.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<Faculty>.Ok(entity, "Status updated."));
        }
    }

    public class FacultyFormDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Designation { get; set; }
        public string? Qualification { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Bio { get; set; }
        public int DisplayOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public IFormFile? Photo { get; set; }
    }
}
