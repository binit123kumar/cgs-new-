using System.ComponentModel.DataAnnotations;

namespace CGS.CMS.API.Models
{
    public class ReportConfig
    {
        [Key]
        public int Id { get; set; }

        public bool IsActive { get; set; } = true;

        public int ReportHour { get; set; } = 11;

        public int ReportMinute { get; set; } = 0;

        public string ReportFormat { get; set; } = "Word";

        public bool IncludeGitLog { get; set; } = true;

        public bool IncludeDbChanges { get; set; } = true;

        public int RetentionDays { get; set; } = 30;

        public string ReportStoragePath { get; set; } = "wwwroot/reports";

        public DateTime LastGeneratedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
