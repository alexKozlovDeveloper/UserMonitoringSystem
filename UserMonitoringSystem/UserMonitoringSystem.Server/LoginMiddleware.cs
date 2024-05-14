using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using UserMonitoringSystem.Server.Data;
using UserMonitoringSystem.Server.Data.Entities;

namespace UserMonitoringSystem.Server
{
    public class LoginMiddleware(
        RequestDelegate next
        )
    {
        private readonly RequestDelegate _next = next;

        public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext)
        {
            await _next(context);

            if(context.User.Identity.IsAuthenticated && context.Request.Path == "/login")
            {
                await SetLoginInfo(dbContext, context.User.Identity.Name);
            }
        }

        private async Task SetLoginInfo(ApplicationDbContext dbContext, string userName)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(a => a.UserName == userName);

            user.LoginCount++;
            user.LastLoginAt = DateTime.Now;

            var entry = dbContext.Update(user);
            await dbContext.SaveChangesAsync();
        }
    }
}
