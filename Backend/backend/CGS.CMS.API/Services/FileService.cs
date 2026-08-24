using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace CGS.CMS.API.Services
{
    // Saves files under wwwroot/uploads/{subFolder}/ and returns a web-relative path
    // like "/uploads/about/guid_filename.jpg" that the frontend can use directly.
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;
        private readonly Cloudinary _cloudinary;
        private readonly bool _useCloudinary;
        private static readonly string[] AllowedExtensions =
            { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx" };

        // Any of these get re-encoded to .webp on save to keep upload sizes small.
        private static readonly string[] ImageExtensions =
            { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

        public FileService(IWebHostEnvironment env, IConfiguration configuration)
        {
            _env = env;
            var cloudName = configuration["Cloudinary:CloudName"];
            var apiKey = configuration["Cloudinary:ApiKey"];
            var apiSecret = configuration["Cloudinary:ApiSecret"];
            _useCloudinary = !string.IsNullOrWhiteSpace(cloudName) &&
                !string.IsNullOrWhiteSpace(apiKey) && !string.IsNullOrWhiteSpace(apiSecret);
            _cloudinary = new Cloudinary(new Account(cloudName, apiKey, apiSecret));
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

            if (_useCloudinary)
            {
                await using var uploadStream = file.OpenReadStream();
                var publicId = $"cgs/{subFolder}/{Guid.NewGuid():N}";
                UploadResult result = ImageExtensions.Contains(ext)
                    ? await _cloudinary.UploadAsync(new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, uploadStream),
                        PublicId = publicId,
                        Transformation = new Transformation().Quality("auto").FetchFormat("auto")
                    })
                    : await _cloudinary.UploadAsync(new RawUploadParams
                    {
                        File = new FileDescription(file.FileName, uploadStream),
                        PublicId = publicId
                    });

                if (result.StatusCode != System.Net.HttpStatusCode.OK)
                    throw new InvalidOperationException("Cloudinary upload failed.");
                return result.SecureUrl?.ToString() ?? throw new InvalidOperationException("Cloudinary returned no URL.");
            }

            var uploadsRoot = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads", subFolder);
            Directory.CreateDirectory(uploadsRoot);

            // Images -> always saved as .webp (much smaller than jpg/png at similar quality).
            if (ImageExtensions.Contains(ext))
            {
                var webpFileName = $"{Guid.NewGuid():N}.webp";
                var webpFullPath = Path.Combine(uploadsRoot, webpFileName);

                using (var inputStream = file.OpenReadStream())
                using (var image = await Image.LoadAsync(inputStream))
                {
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
            if (string.IsNullOrWhiteSpace(relativePath)) return;
            if (_useCloudinary && relativePath.StartsWith("http", StringComparison.OrdinalIgnoreCase)) return;
            var fullPath = Path.Combine(_env.WebRootPath ?? "wwwroot", relativePath.TrimStart('/').Replace("uploads/", "uploads" + Path.DirectorySeparatorChar));
            if (File.Exists(fullPath)) File.Delete(fullPath);
        }
    }
}