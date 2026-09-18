using CGS.CMS.API.DTOs;
using System.Diagnostics;
using System.Text.Json;

namespace CGS.CMS.API.Services
{
    public interface IGitService
    {
        Task<List<GitCommitDto>> GetCommitsSince(DateTime since);
        Task<List<GitCommitDto>> GetRecentCommits(int count = 50);
        Task<string> GetCurrentBranch();
        Task<bool> IsGitRepository();
    }

    public class GitService : IGitService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<GitService> _logger;

        public GitService(
            IWebHostEnvironment env,
            ILogger<GitService> logger)
        {
            _env = env;
            _logger = logger;
        }

        private string RepoPath => _env.ContentRootPath;

        public async Task<bool> IsGitRepository()
        {
            try
            {
                var result = await RunGitCommand("rev-parse --is-inside-work-tree");
                return result.Trim().Equals("true", StringComparison.OrdinalIgnoreCase);
            }
            catch
            {
                return false;
            }
        }

        public async Task<string> GetCurrentBranch()
        {
            try
            {
                var result = await RunGitCommand("branch --show-current");
                return result.Trim();
            }
            catch
            {
                return "unknown";
            }
        }

        public async Task<List<GitCommitDto>> GetRecentCommits(int count = 50)
        {
            var commits = new List<GitCommitDto>();

            try
            {
                var output = await RunGitCommand(
                    $"log -{count} --pretty=format:\"%H|%an|%ae|%aI|%s\" --name-only --no-merges");

                if (string.IsNullOrWhiteSpace(output))
                    return commits;

                var lines = output
                    .Split('\n', StringSplitOptions.RemoveEmptyEntries)
                    .ToList();

                GitCommitDto? current = null;
                var files = new List<string>();

                foreach (var line in lines)
                {
                    if (line.Contains('|') && !line.StartsWith(" "))
                    {
                        if (current != null)
                        {
                            current.FilesChanged = string.Join(", ", files);
                            commits.Add(current);
                        }

                        var parts = line.Split('|', 5);

                        if (parts.Length >= 5)
                        {
                            current = new GitCommitDto
                            {
                                Hash = parts[0].Trim(),
                                Author = parts[1].Trim(),
                                FilesChanged = "",
                                ShortMessage = parts[4].Trim().Length > 80
                                    ? parts[4].Trim()[..80]
                                    : parts[4].Trim()
                            };

                            current.Message = current.ShortMessage;
                            files = new List<string>();
                        }
                    }
                    else if (current != null && !string.IsNullOrWhiteSpace(line))
                    {
                        var file = line.Trim();

                        if (file.StartsWith(" ") ||
                            System.IO.Path.IsPathRooted(file) ||
                            file.Contains("/") ||
                            file.Contains("\\"))
                        {
                            files.Add(file.TrimStart());
                        }
                    }
                }

                if (current != null)
                {
                    current.FilesChanged = string.Join(", ", files);
                    commits.Add(current);
                }

                foreach (var commit in commits)
                {
                    if (DateTime.TryParse(
                        commit.Date.ToString("yyyy-MM-ddTHH:mm:ss"),
                        out var parsed))
                    {
                        commit.Date = parsed;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Failed to get recent git commits");
            }

            return commits;
        }

        public async Task<List<GitCommitDto>> GetCommitsSince(DateTime since)
        {
            var all = await GetRecentCommits(500);
            return all.Where(c => c.Date >= since).ToList();
        }

        private async Task<string> RunGitCommand(string arguments)
        {
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "git",
                    Arguments = arguments,
                    WorkingDirectory = RepoPath,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            process.Start();

            var output = await process.StandardOutput.ReadToEndAsync();
            await process.WaitForExitAsync();

            return output;
        }
    }
}
