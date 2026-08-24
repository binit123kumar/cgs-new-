using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CGS.CMS.API.Data;
using CGS.CMS.API.Helpers;
using CGS.CMS.API.Models;

namespace CGS.CMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AimObjectiveController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public AimObjectiveController(ApplicationDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(ApiResponse<List<AimObjectiveItem>>.Ok(await _db.AimObjectiveItems.OrderBy(x => x.DisplayOrder).ToListAsync()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _db.AimObjectiveItems.FindAsync(id);
            return item == null ? NotFound(ApiResponse<object>.Fail("Record not found.")) : Ok(ApiResponse<AimObjectiveItem>.Ok(item));
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> Create([FromForm] AimObjectiveFormDto dto)
        {
            var entity = new AimObjectiveItem
            {
                SectionLabel = dto.SectionLabel,
                Heading = dto.Heading,
                Body = dto.Body,
                IconKey = dto.IconKey,
                DisplayOrder = dto.DisplayOrder,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };
            _db.AimObjectiveItems.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<AimObjectiveItem>.Ok(entity, "Item created successfully."));
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] AimObjectiveFormDto dto)
        {
            var entity = await _db.AimObjectiveItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.SectionLabel = dto.SectionLabel; entity.Heading = dto.Heading; entity.Body = dto.Body; entity.IconKey = dto.IconKey;
            entity.DisplayOrder = dto.DisplayOrder; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<AimObjectiveItem>.Ok(entity, "Item updated successfully."));
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.AimObjectiveItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            _db.AimObjectiveItems.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(null!, "Item deleted successfully."));
        }

        [HttpPatch("{id}/toggle-status"), Authorize]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var entity = await _db.AimObjectiveItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.IsActive = !entity.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<AimObjectiveItem>.Ok(entity, "Status updated."));
        }
    }

    public class AimObjectiveFormDto
    {
        public string SectionLabel { get; set; } = string.Empty;
        public string? Heading { get; set; }
        public string Body { get; set; } = string.Empty;
        public string? IconKey { get; set; }
        public int DisplayOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
    }
}