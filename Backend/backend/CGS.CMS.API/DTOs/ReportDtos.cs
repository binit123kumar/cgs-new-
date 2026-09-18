using System.ComponentModel.DataAnnotations;

namespace CGS.CMS.API.DTOs
{
    public class GenerateReportRequestDto
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool IncludeGitLog { get; set; } = true;
        public bool IncludeDbChanges { get; set; } = true;
        public string? CategoryFilter { get; set; }
    }

    public class ReportSummaryDto
    {
        public int TotalEntries { get; set; }
        public int CodeChanges { get; set; }
        public int ContentUpdates { get; set; }
        public int ConfigChanges { get; set; }
        public int DbMigrations { get; set; }
        public DateTime GeneratedAt { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public string DownloadUrl { get; set; } = string.Empty;
        public string Md5Hash { get; set; } = string.Empty;
        public string Format { get; set; } = "Word";
    }

    public class ReportEntryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string ChangedFiles { get; set; } = string.Empty;
        public string ChangeType { get; set; } = string.Empty;
        public string PerformedBy { get; set; } = string.Empty;
        public DateTime PerformedAt { get; set; }
        public string Condition { get; set; } = string.Empty;
        public string? GitCommitHash { get; set; }
        public string? GitBranch { get; set; }
    }

    public class GitCommitDto
    {
        public string Hash { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Branch { get; set; } = string.Empty;
        public string FilesChanged { get; set; } = string.Empty;
        public string ShortMessage { get; set; } = string.Empty;
    }

    public class ReportConfigDto
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
        public int ReportHour { get; set; }
        public int ReportMinute { get; set; }
        public string ReportFormat { get; set; } = "Word";
        public bool IncludeGitLog { get; set; }
        public bool IncludeDbChanges { get; set; }
        public int RetentionDays { get; set; }
        public DateTime LastGeneratedAt { get; set; }
    }

    public class UpdateReportConfigDto
    {
        public bool? IsActive { get; set; }
        public int? ReportHour { get; set; }
        public int? ReportMinute { get; set; }
        public string? ReportFormat { get; set; }
        public bool? IncludeGitLog { get; set; }
        public bool? IncludeDbChanges { get; set; }
        public int? RetentionDays { get; set; }
    }
}
