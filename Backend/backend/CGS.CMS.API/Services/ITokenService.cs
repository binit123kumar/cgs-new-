using CGS.CMS.API.Models;

namespace CGS.CMS.API.Services
{
    public interface ITokenService
    {
        (string token, DateTime expiresAt) GenerateToken(AdminUser user);
    }
}
