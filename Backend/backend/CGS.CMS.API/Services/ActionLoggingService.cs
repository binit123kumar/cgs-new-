using CGS.CMS.API.Data;
using System.Text.Json;

namespace CGS.CMS.API.Services
{
    public interface IActionLoggingService
    {
        Task LogAction(string title, string description, string category, string changedFiles, string changeType, string performedBy, string condition);
    }

    public class ActionLoggingService : IActionLoggingService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<ActionLoggingService> _logger;

        public ActionLoggingService(ApplicationDbContext db, ILogger<ActionLoggingService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task LogAction(string title, string description, string category, string changedFiles, string changeType, string performedBy, string condition)
        {
            try
            {
                var entry = new Models.ReportEntry
                {
                    Title = title,
                    Description = description,
                    Category = category,
                    ChangedFiles = changedFiles,
                    ChangeType = changeType,
                    PerformedBy = performedBy,
                    PerformedAt = DateTime.UtcNow,
                    Condition = condition,
                    IsFromGit = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _db.ReportEntries.Add(entry);
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to log action");
            }
        }
    }
}
