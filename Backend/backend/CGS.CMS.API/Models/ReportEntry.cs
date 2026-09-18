using System.ComponentModel.DataAnnotations;

namespace CGS.CMS.API.Models
{
    public class ReportEntry
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string ChangedFiles { get; set; } = string.Empty;

        public string ChangeType { get; set; } = string.Empty;

        public string PerformedBy { get; set; } = string.Empty;

        public DateTime PerformedAt { get; set; } = DateTime.UtcNow;

        public string Condition { get; set; } = string.Empty;

        public bool IsFromGit { get; set; }

        public string? GitCommitHash { get; set; }

        public string? GitBranch { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
