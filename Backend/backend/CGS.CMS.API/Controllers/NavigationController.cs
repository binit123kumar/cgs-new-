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
    public class NavigationController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public NavigationController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.NavigationItems
                .Where(x => x.IsActive)
                .OrderBy(x => x.DisplayOrder)
                .ToListAsync();

            var roots = items.Where(x => x.ParentId == null).ToList();
            foreach (var root in roots)
            {
                root.Children = items.Where(x => x.ParentId == root.Id).OrderBy(x => x.DisplayOrder).ToList();
            }

            return Ok(ApiResponse<List<NavigationItem>>.Ok(roots));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _db.NavigationItems.FindAsync(id);
            return item == null ? NotFound(ApiResponse<object>.Fail("Record not found.")) : Ok(ApiResponse<NavigationItem>.Ok(item));
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> Create([FromBody] NavigationFormDto dto)
        {
            var entity = new NavigationItem
            {
                Label = dto.Label,
                Url = dto.Url,
                ParentId = dto.ParentId,
                IconKey = dto.IconKey,
                IsExternal = dto.IsExternal,
                OpenInNewTab = dto.OpenInNewTab,
                DisplayOrder = dto.DisplayOrder,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };
            _db.NavigationItems.Add(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<NavigationItem>.Ok(entity, "Navigation item added successfully."));
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] NavigationFormDto dto)
        {
            var entity = await _db.NavigationItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));

            entity.Label = dto.Label;
            entity.Url = dto.Url;
            entity.ParentId = dto.ParentId;
            entity.IconKey = dto.IconKey;
            entity.IsExternal = dto.IsExternal;
            entity.OpenInNewTab = dto.OpenInNewTab;
            entity.DisplayOrder = dto.DisplayOrder;
            entity.IsActive = dto.IsActive;
            entity.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(ApiResponse<NavigationItem>.Ok(entity, "Navigation item updated successfully."));
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _db.NavigationItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));

            var children = await _db.NavigationItems.Where(x => x.ParentId == id).ToListAsync();
            _db.NavigationItems.RemoveRange(children);
            _db.NavigationItems.Remove(entity);
            await _db.SaveChangesAsync();

            return Ok(ApiResponse<object>.Ok(null!, "Navigation item deleted successfully."));
        }

        [HttpPatch("{id}/toggle-status"), Authorize]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var entity = await _db.NavigationItems.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<object>.Fail("Record not found."));
            entity.IsActive = !entity.IsActive;
            entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<NavigationItem>.Ok(entity, "Status updated."));
        }
    }

    public class NavigationFormDto
    {
        public string Label { get; set; } = string.Empty;
        public string? Url { get; set; }
        public int? ParentId { get; set; }
        public string? IconKey { get; set; }
        public bool IsExternal { get; set; }
        public bool OpenInNewTab { get; set; }
        public int DisplayOrder { get; set; } = 1;
        public bool IsActive { get; set; } = true;
    }
}