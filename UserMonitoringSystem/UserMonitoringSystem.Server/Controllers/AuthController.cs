using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UserMonitoringSystem.Server.Data.Entities;

namespace UserMonitoringSystem.Server.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        /// <summary>
        /// This method is taken from <see href="https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-8.0#log-out">How to use Identity to secure a Web API backend for SPAs</see>
        /// </summary>
        /// <param name="signInManager"></param>
        /// <param name="empty"></param>
        /// <returns></returns>
        [HttpPost("/logout")]
        public async Task<IResult> Logout(
            SignInManager<User> signInManager,
            [FromBody] object empty
            )
        {
            if (empty != null)
            {
                await signInManager.SignOutAsync();
                return Results.Ok();
            }
            return Results.Unauthorized();
        }
    }
}
