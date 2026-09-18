using CGS.CMS.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CGS.CMS.API.Services
{
    public class ReportBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ReportBackgroundService> _logger;
        private Timer? _timer;

        public ReportBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<ReportBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation(
                "Report Background Service started. Will check for daily report generation.");

            _timer = new Timer(
                async _ => await OnTimerCallback(stoppingToken),
                null,
                TimeSpan.FromMinutes(1),
                TimeSpan.FromMinutes(1));

            await Task.CompletedTask;
        }

        private async Task OnTimerCallback(CancellationToken stoppingToken)
        {
            try
            {
                if (stoppingToken.IsCancellationRequested)
                    return;

                using var scope = _serviceProvider.CreateScope();

                var db = scope.ServiceProvider
                    .GetRequiredService<ApplicationDbContext>();

                var config = await db.ReportConfigs.FirstOrDefaultAsync(stoppingToken);

                if (config == null || !config.IsActive)
                    return;

                var now = DateTime.UtcNow;

                var scheduledTime = new DateTime(
                    now.Year,
                    now.Month,
                    now.Day,
                    config.ReportHour,
                    config.ReportMinute,
                    0,
                    DateTimeKind.Utc);

                var nextRun = scheduledTime.AddDays(1);

                if (now >= scheduledTime &&
                    now < scheduledTime.AddMinutes(5) &&
                    config.LastGeneratedAt < scheduledTime)
                {
                    _logger.LogInformation(
                        "Daily report generation triggered at {Time}", now);

                    await GenerateDailyReport(scope, config, now);

                    config.LastGeneratedAt = now;
                    config.UpdatedAt = now;

                    await db.SaveChangesAsync(stoppingToken);
                }

                var delay = nextRun - now;

                if (delay > TimeSpan.Zero && _timer != null)
                {
                    _timer.Change(delay, Timeout.InfiniteTimeSpan);
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Report background service cancellation requested.");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Error in report background service timer callback");
            }
        }

        private async Task GenerateDailyReport(
            IServiceScope scope,
            Models.ReportConfig config,
            DateTime now)
        {
            try
            {
                var gitService = scope.ServiceProvider
                    .GetRequiredService<IGitService>();

                var reportService = scope.ServiceProvider
                    .GetRequiredService<IReportService>();

                var db = scope.ServiceProvider
                    .GetRequiredService<ApplicationDbContext>();

                var actionLog = scope.ServiceProvider
                    .GetRequiredService<IActionLoggingService>();

                var since = now.AddDays(-1);

                var commits = await gitService.GetCommitsSince(since);

                var entries = await db.ReportEntries
                    .Where(e => e.IsActive && e.PerformedAt >= since)
                    .ToListAsync();

                if (commits.Count == 0 && entries.Count == 0)
                {
                    _logger.LogInformation(
                        "No changes detected for today's report generation.");
                    return;
                }

                var fileName = await reportService.GenerateWordReportAsync(
                    commits,
                    entries,
                    config,
                    "System");

                var reportsDirectory = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "reports");

                var reportPath = Path.Combine(reportsDirectory, fileName);

                var hash = await reportService.GetMd5HashAsync(reportPath);

                _logger.LogInformation(
                    "Daily report generated: {File} | Hash: {Hash}",
                    fileName,
                    hash);

                await actionLog.LogAction(
                    "Daily Report Generated",
                    $"Automated daily report generated with {commits.Count} git commits and {entries.Count} action entries.",
                    "Report",
                    "Multiple",
                    "Auto-Generated",
                    "System",
                    $"Scheduled at {config.ReportHour}:{config.ReportMinute:d2} UTC daily"
                );
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Failed to generate daily report");
            }
        }

        public override void Dispose()
        {
            _timer?.Dispose();
            base.Dispose();
        }
    }
}
