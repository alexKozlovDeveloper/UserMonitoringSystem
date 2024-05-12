using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace UserMonitoringSystem.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController
    {
        [Authorize]
        [HttpPost("/logout")]
        public async Task<IResult> Logout(
            SignInManager<IdentityUser> signInManager,
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
