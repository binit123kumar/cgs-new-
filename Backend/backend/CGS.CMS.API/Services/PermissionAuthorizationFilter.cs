using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CGS.CMS.API.Services
{
    // Public GET requests remain public. Once a JWT is supplied, the same
    // endpoint is checked so the CMS cannot bypass permissions by URL.
    public sealed class PermissionAuthorizationFilter : IAsyncActionFilter
    {
        private static readonly HashSet<string> ReadOnlyControllers = new(StringComparer.OrdinalIgnoreCase)
        { "Dashboard" };

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var principal = context.HttpContext.User;
            if (principal.Identity?.IsAuthenticated != true)
            {
                await next();
                return;
            }

            if (string.Equals(principal.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value, "Super Admin", StringComparison.OrdinalIgnoreCase))
            {
                await next();
                return;
            }

            var controller = context.RouteData.Values["controller"]?.ToString() ?? string.Empty;
            if (ReadOnlyControllers.Contains(controller))
            {
                await next();
                return;
            }

            var module = ToModuleKey(controller);
            var action = context.HttpContext.Request.Method.ToUpperInvariant() switch
            {
                "GET" => "read",
                "POST" => "create",
                "PUT" => "update",
                "PATCH" => "update",
                "DELETE" => "delete",
                _ => string.Empty
            };

            var permissions = Parse(principal.FindFirst("permissions")?.Value);
            if (!permissions.TryGetValue(module, out var allowed) || !allowed.Contains(action, StringComparer.OrdinalIgnoreCase))
            {
                context.Result = new ObjectResult(new { success = false, message = $"You do not have {action} access to {module}." })
                { StatusCode = StatusCodes.Status403Forbidden };
                return;
            }

            await next();
        }

        private static string ToModuleKey(string controller) => controller.EndsWith("Controller", StringComparison.OrdinalIgnoreCase)
            ? controller[..^10].ToLowerInvariant()
            : controller.ToLowerInvariant();

        private static Dictionary<string, List<string>> Parse(string? json)
        {
            try { return JsonSerializer.Deserialize<Dictionary<string, List<string>>>(json ?? "{}") ?? new(); }
            catch (JsonException) { return new(); }
        }
    }
}