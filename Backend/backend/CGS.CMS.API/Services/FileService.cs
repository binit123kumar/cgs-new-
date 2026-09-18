using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace CGS.CMS.API.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;
        private readonly Cloudinary _cloudinary;
        private readonly bool _useCloudinary;

        private static readonly string[] AllowedExtensions =
            { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx" };

        private static readonly string[] ImageExtensions =
            { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB
        private const int MaxImageDimension = 2000;

        public FileService(IWebHostEnvironment env, IConfiguration configuration)
        {
            _env = env;

            var cloudName = configuration["Cloudinary:CloudName"];
            var apiKey = configuration["Cloudinary:ApiKey"];
            var apiSecret = configuration["Cloudinary:ApiSecret"];

            _useCloudinary =
                !string.IsNullOrWhiteSpace(cloudName) &&
                !string.IsNullOrWhiteSpace(apiKey) &&
                !string.IsNullOrWhiteSpace(apiSecret);

            if (_useCloudinary)
            {
                _cloudinary = new Cloudinary(
                    new Account(cloudName, apiKey, apiSecret)
                );
            }
            else
            {
                _cloudinary = null!;
            }
        }

        public async Task<string> SaveFileAsync(IFormFile file, string subFolder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided.");

            if (file.Length > MaxFileSizeBytes)
                throw new ArgumentException("File exceeds the 10 MB limit.");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!AllowedExtensions.Contains(ext))
                throw new ArgumentException($"File type '{ext}' is not allowed.");

            // Sanitize subfolder name
            subFolder = SanitizeFolderName(subFolder);

            if (_useCloudinary)
            {
                await using var uploadStream = file.OpenReadStream();

                var publicId = $"cgs/{subFolder}/{Guid.NewGuid():N}";

                UploadResult result = ImageExtensions.Contains(ext)
                    ? await _cloudinary.UploadAsync(new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, uploadStream),
                        PublicId = publicId,
                        Transformation = new Transformation()
                            .Quality("auto")
                            .FetchFormat("auto")
                    })
                    : await _cloudinary.UploadAsync(new RawUploadParams
                    {
                        File = new FileDescription(file.FileName, uploadStream),
                        PublicId = publicId
                    });

                if (result.StatusCode != System.Net.HttpStatusCode.OK)
                    throw new InvalidOperationException("Cloudinary upload failed.");

                return result.SecureUrl?.ToString()
                    ?? throw new InvalidOperationException(
                        "Cloudinary returned no URL.");
            }

            var uploadsRoot = Path.Combine(
                _env.WebRootPath ?? "wwwroot",
                "uploads",
                subFolder);

            Directory.CreateDirectory(uploadsRoot);

            // Images -> always saved as .webp
            // (much smaller than jpg/png at similar quality).
            if (ImageExtensions.Contains(ext))
            {
                var webpFileName = $"{Guid.NewGuid():N}.webp";
                var webpFullPath = Path.Combine(uploadsRoot, webpFileName);

                using (var inputStream = file.OpenReadStream())
                using (var image = await Image.LoadAsync(inputStream))
                {
                    // Resize if too large
                    if (image.Width > MaxImageDimension ||
                        image.Height > MaxImageDimension)
                    {
                        image.Mutate(x => x.Resize(new ResizeOptions
                        {
                            Mode = ResizeMode.Max,
                            Size = new SixLabors.ImageSharp.Size(
                                MaxImageDimension,
                                MaxImageDimension)
                        }));
                    }

                    var encoder = new WebpEncoder { Quality = 80 };
                    await image.SaveAsync(webpFullPath, encoder);
                }

                return $"/uploads/{subFolder}/{webpFileName}";
            }

            // Non-image files (PDF/DOC/DOCX) -> saved as-is.
            var fileName = $"{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(uploadsRoot, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{subFolder}/{fileName}";
        }

        public void DeleteFile(string? relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath))
                return;

            if (_useCloudinary &&
                relativePath.StartsWith(
                    "http",
                    StringComparison.OrdinalIgnoreCase))
                return;

            var cleanPath = relativePath
                .TrimStart('/')
                .Replace(
                    "/",
                    Path.DirectorySeparatorChar.ToString());

            var fullPath = Path.Combine(
                _env.WebRootPath ?? "wwwroot",
                cleanPath);

            if (File.Exists(fullPath))
                File.Delete(fullPath);
        }

        private static string SanitizeFolderName(string folder)
        {
            var invalidChars = Path.GetInvalidFileNameChars();

            var sanitized = new string(
                folder.Where(c => !invalidChars.Contains(c)).ToArray());

            return string.IsNullOrWhiteSpace(sanitized)
                ? "misc"
                : sanitized;
        }
    }
}
