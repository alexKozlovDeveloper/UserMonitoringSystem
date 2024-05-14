using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UserMonitoringSystem.Server.Data.Entities;

namespace UserMonitoringSystem.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        [Authorize]
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
