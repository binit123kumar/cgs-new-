namespace CGS.CMS.API.Services
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string subFolder);
        void DeleteFile(string? relativePath);
    }
}
