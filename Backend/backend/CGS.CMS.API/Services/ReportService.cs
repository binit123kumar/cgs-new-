using CGS.CMS.API.Data;
using System.IO;
using System.Text;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Text.Json;
using CGS.CMS.API.DTOs;
using CGS.CMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CGS.CMS.API.Services
{
    public interface IReportService
    {
        Task<string> GenerateWordReportAsync(List<GitCommitDto> commits, List<ReportEntry> entries, ReportConfig config, string userName);
        Task<string> GetLatestReportPathAsync();
        Task<string> GetMd5HashAsync(string filePath);
        Task<ReportSummaryDto> GetLatestSummaryAsync();
    }

    public class ReportService : IReportService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ApplicationDbContext _db;
        private readonly ILogger<ReportService> _logger;

        public ReportService(IWebHostEnvironment env, ApplicationDbContext db, ILogger<ReportService> logger)
        {
            _env = env;
            _db = db;
            _logger = logger;
        }

        private string ReportsPath => Path.Combine(_env.WebRootPath ?? "wwwroot", "reports");

        public async Task<string> GenerateWordReportAsync(List<GitCommitDto> commits, List<ReportEntry> entries, ReportConfig config, string userName)
        {
            Directory.CreateDirectory(ReportsPath);

            var dateStamp = DateTime.UtcNow.ToString("yyyy-MM-dd_HHmmss");
            var fileName = $"CGS_Report_{dateStamp}.docx";
            var filePath = Path.Combine(ReportsPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create, FileAccess.Write);
            using var document = WordprocessingDocument.Create(stream, DocumentFormat.OpenXml.WordprocessingDocumentType.Document);

            var mainPart = document.AddMainDocumentPart();
            mainPart.Document = new Document();
            var body = mainPart.Document.AppendChild(new Body());

            // Title
            var titleParagraph = new Paragraph();
            var titleRun = new Run();
            var titleText = new Text("CGS CMS - Daily Change Report");
            titleRun.Append(titleText);
            var titleSize = new FontSize { Val = "48" };
            var titleBold = new Bold();
            titleRun.Append(titleBold);
            titleRun.Append(titleSize);
            titleParagraph.Append(titleRun);
            body.Append(titleParagraph);

            // Subtitle
            var subParagraph = new Paragraph();
            var subRun = new Run();
            var subText = new Text($"Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC | By: {userName}");
            subRun.Append(subText);
            var subItalic = new Italic();
            subRun.Append(subItalic);
            subParagraph.Append(subRun);
            body.Append(subParagraph);

            // Separator
            var sep = new Paragraph();
            sep.Append(new Run(new Text("─".PadRight(80, '─'))));
            body.Append(sep);

            // Summary section
            var summaryHeader = new Paragraph();
            var summaryRun = new Run(new Text("SUMMARY"));
            var summaryBold = new Bold();
            summaryRun.Append(summaryBold);
            summaryHeader.Append(summaryRun);
            body.Append(summaryHeader);

            var summaryItems = new[]
            {
                $"Total Git Commits: {commits.Count}",
                $"Total Logged Actions: {entries.Count}",
                $"Report Period: {(entries.Count > 0 ? entries.Min(e => e.PerformedAt).ToString("yyyy-MM-dd") : "N/A")} to {(entries.Count > 0 ? entries.Max(e => e.PerformedAt).ToString("yyyy-MM-dd") : DateTime.UtcNow.ToString("yyyy-MM-dd"))}",
                $"Git Branch: {(commits.Count > 0 ? commits[0].Branch : "N/A")}"
            };

            foreach (var item in summaryItems)
            {
                var p = new Paragraph(new Run(new Text($"• {item}")));
                body.Append(p);
            }

            // GIT CHANGES section
            if (commits.Count > 0)
            {
                body.Append(new Paragraph(new Run(new Text(""))));

                var gitHeader = new Paragraph();
                var gitRun = new Run(new Text("GIT CODE CHANGES"));
                var gitBold = new Bold();
                gitRun.Append(gitBold);
                gitHeader.Append(gitRun);
                body.Append(gitHeader);

                var gitSep = new Paragraph(new Run(new Text("─".PadRight(80, '─'))));
                body.Append(gitSep);

                int counter = 1;
                foreach (var commit in commits.OrderByDescending(c => c.Date))
                {
                    var commitPara = new Paragraph();
                    var numRun = new Run(new Text($"{counter}. "));
                    var numBold = new Bold();
                    numRun.Append(numBold);
                    commitPara.Append(numRun);

                    var titleRun2 = new Run(new Text(commit.ShortMessage));
                    var titleBold2 = new Bold();
                    titleRun2.Append(titleBold2);
                    commitPara.Append(titleRun2);
                    body.Append(commitPara);

                    var details = new[]
                    {
                        $"   What: {commit.Message}",
                        $"   When: {commit.Date:yyyy-MM-dd HH:mm:ss} UTC",
                        $"   Who: {commit.Author}",
                        $"   How: Git commit on branch '{commit.Branch}'",
                        $"   Condition: Code change via development workflow",
                        $"   Files: {commit.FilesChanged}",
                        $"   Hash: {commit.Hash[..Math.Min(8, commit.Hash.Length)]}"
                    };

                    foreach (var d in details)
                    {
                        body.Append(new Paragraph(new Run(new Text(d))));
                    }

                    counter++;
                }
            }

            // CMS ACTION LOGS section
            if (entries.Count > 0)
            {
                body.Append(new Paragraph(new Run(new Text(""))));

                var cmsHeader = new Paragraph();
                var cmsRun = new Run(new Text("CMS ADMIN ACTIONS"));
                var cmsBold = new Bold();
                cmsRun.Append(cmsBold);
                cmsHeader.Append(cmsRun);
                body.Append(cmsHeader);

                var cmsSep = new Paragraph(new Run(new Text("─".PadRight(80, '─'))));
                body.Append(cmsSep);

                int counter = 1;
                foreach (var entry in entries.OrderByDescending(e => e.PerformedAt))
                {
                    var entryPara = new Paragraph();
                    var numRun = new Run(new Text($"{counter}. "));
                    var numBold = new Bold();
                    numRun.Append(numBold);
                    entryPara.Append(numRun);

                    var titleRun2 = new Run(new Text(entry.Title));
                    var titleBold2 = new Bold();
                    titleRun2.Append(titleBold2);
                    entryPara.Append(titleRun2);
                    body.Append(entryPara);

                    var details = new[]
                    {
                        $"   What: {entry.Description}",
                        $"   How: {entry.ChangeType} - {entry.Category}",
                        $"   When: {entry.PerformedAt:yyyy-MM-dd HH:mm:ss} UTC",
                        $"   Who: {entry.PerformedBy}",
                        $"   Condition: {entry.Condition}",
                        $"   Files: {entry.ChangedFiles}"
                    };

                    foreach (var d in details)
                    {
                        body.Append(new Paragraph(new Run(new Text(d))));
                    }

                    counter++;
                }
            }

            // Footer
            body.Append(new Paragraph(new Run(new Text(""))));
            var footerPara = new Paragraph();
            var footerRun = new Run(new Text($"Report ID: {dateStamp} | Hash: PENDING | Format: Word (.docx) | CGS CMS Automated Report"));
            footerRun.Append(new Italic());
            footerPara.Append(footerRun);
            body.Append(footerPara);

            document.Save();
            return fileName;
        }

        public async Task<string> GetLatestReportPathAsync()
        {
            if (!Directory.Exists(ReportsPath)) return string.Empty;
            var files = Directory.GetFiles(ReportsPath, "*.docx")
                .OrderByDescending(f => File.GetCreationTime(f))
                .ToList();
            return files.Count > 0 ? files[0] : string.Empty;
        }

        public async Task<string> GetMd5HashAsync(string filePath)
        {
            using var stream = File.OpenRead(filePath);
            using var md5 = System.Security.Cryptography.MD5.Create();
            var hash = await md5.ComputeHashAsync(stream);
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
        }

        public async Task<ReportSummaryDto> GetLatestSummaryAsync()
        {
            var latestPath = await GetLatestReportPathAsync();
            if (string.IsNullOrEmpty(latestPath))
                return new ReportSummaryDto();

            var entries = await _db.ReportEntries.Where(e => e.IsActive).ToListAsync();
            var config = await _db.ReportConfigs.FirstOrDefaultAsync();
            var hash = await GetMd5HashAsync(latestPath);

            var fileName = Path.GetFileName(latestPath);

            return new ReportSummaryDto
            {
                TotalEntries = entries.Count,
                GeneratedAt = File.GetCreationTime(latestPath),
                FilePath = latestPath,
                DownloadUrl = $"/reports/{fileName}",
                Md5Hash = hash,
                Format = config?.ReportFormat ?? "Word",
                CodeChanges = entries.Count(e => e.Category.Equals("Code Change", StringComparison.OrdinalIgnoreCase)),
                ContentUpdates = entries.Count(e => e.Category.Equals("Content Update", StringComparison.OrdinalIgnoreCase)),
                ConfigChanges = entries.Count(e => e.Category.Equals("Config Change", StringComparison.OrdinalIgnoreCase)),
                DbMigrations = entries.Count(e => e.Category.Equals("Database", StringComparison.OrdinalIgnoreCase))
            };
        }
    }
}
