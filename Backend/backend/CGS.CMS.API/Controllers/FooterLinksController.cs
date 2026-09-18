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
    public class FooterLinksController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public FooterLinksController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.FooterLinks
                .Where(x => x.IsActive)
                .OrderBy(x => x.Section)
                .ThenBy(x => x.DisplayOrder)
                .ToListAsync();

            return Ok(ApiResponse<List<FooterLink>>.Ok(items));
        }

        [HttpGet("grouped")]
        public async Task<IActionResult> GetGrouped()
        {
            var items = await _db.FooterLinks
                .Where(x => x.IsActive)
                .OrderBy(x => x.Section)
                .ThenBy(x => x.DisplayOrder)
                .ToListAsync();

            var grouped = items
                .GroupBy(x => x.Section)
                .ToDictionary(g => g.Key, g => g.ToList());

            return Ok(ApiResponse<Dictionary<string, List<FooterLink>>>.Ok(grouped));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _db.FooterLinks.FindAsync(id);
            return item == null ? NotFound(ApiResponse<object>.Fail("Record not found.")) : Ok(ApiResponse<FooterLink>.Ok(item));
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> Create([FromBody] FooterLinkFormDto dto)
        {
            var entity = new FooterLink
            {
                Label = dto.Label,
                Url = dto.Url,
                Section = dto.Section,
                IsExternal = dto.IsExternal,
                OpenInNewTab = dto.OpenInNewTab,
                DisplayOrder = dto.DisplayOrder,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };
            _db.FooterLinks.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<FooterLink>.Ok(entity, "Footer link added successfully."));
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] FooterLinkFormDto dto)
        {
            var entity = await _db.FooterLinks.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));

            entity.Label = dto.Label;
            entity.Url = dto.Url;
            entity.Section = dto.Section;
            entity.IsExternal = dto.IsExternal;
            entity.OpenInNewTab = dto.OpenInNewTab;
            entity.DisplayOrder = dto.DisplayOrder;
            entity.IsActive = dto.IsActive;
            entity.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(ApiResponse<FooterLink>.Ok(entity, "Footer link updated successfully."));
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.FooterLinks.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            _db.FooterLinks.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(null!, "Footer link deleted successfully."));
        }

        [HttpPatch("{id}/toggle-status"), Authorize]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var entity = await _db.FooterLinks.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.IsActive = !entity.IsActive;
            entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<FooterLink>.Ok(entity, "Status updated."));
        }
    }

    public class FooterLinkFormDto
    {
        public string Label { get; set; } = string.Empty;
        public string? Url { get; set; }
        public string Section { get; set; } = string.Empty;
        public bool IsExternal { get; set; }
        public bool OpenInNewTab { get; set; }
        public int DisplayOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
    }
}