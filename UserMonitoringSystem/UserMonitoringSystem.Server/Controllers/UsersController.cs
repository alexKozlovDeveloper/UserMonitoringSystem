using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UserMonitoringSystem.Server.Data;
using UserMonitoringSystem.Server.Data.Entities;
using UserMonitoringSystem.Server.Models;

namespace UserMonitoringSystem.Server.Controllers
{
    [ApiController]
    [Authorize]
    [Route("users")]
    public class UsersController(
        ApplicationDbContext dbContext,
        IMapper mapper,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager
        ) : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext = dbContext;
        private readonly IMapper _mapper = mapper;
        private readonly UserManager<User> _userManager = userManager;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;

        private const int MaxImageSizeByte = 1_000_000;

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            var usersWithRoles = await _dbContext.Users
                .GroupJoin(
                    _dbContext.UserRoles,
                    user => user.Id,
                    userRole => userRole.UserId,
                    (user, userRoles) => new { User = user, UserRoles = userRoles }
                )
                .SelectMany(
                    u => u.UserRoles.DefaultIfEmpty(),
                    (u, userRole) => new { u.User, UserRole = userRole }
                )
                .GroupJoin(
                    _dbContext.Roles,
                    ur => ur.UserRole.RoleId,
                    role => role.Id,
                    (ur, roles) => new { ur.User, Role = roles.FirstOrDefault() }
                )
                .ToListAsync();

            var dtos = usersWithRoles.Select(ur =>
            {
                var userDto = _mapper.Map<UserDto>(ur.User);
                userDto.Roles = usersWithRoles
                    .Where(u => u.User.Id == ur.User.Id && u.Role != null)
                    .Select(u => u.Role.Name)
                    .ToArray();
                return userDto;
            }).ToList();

            return dtos;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserDto>> GetUser(string userId, CancellationToken cancellationToken)
        {
            var dto = await GetUserAsDto(userId);

            if (dto == null)
            {
                return NotFound($"User with Id {userId} not found.");
            }

            return dto;
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{userId}")]
        public async Task<ActionResult<UserDto>> DeleteUser(string userId, CancellationToken cancellationToken)
        {
            var currentUserId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (currentUserId == userId)
            {
                return BadRequest("Can't delete the current user.");
            }

            var user = await _dbContext.Users.FirstOrDefaultAsync(a => a.Id == userId, cancellationToken);

            if (user == null)
            {
                return NotFound($"User with Id {userId} not found.");
            }

            var entry = _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return _mapper.Map<UserDto>(user);
        }

        [HttpPost("{userId}:uploadImage")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<UserDto>> UploadFileAsync(string userId, IFormFile file, CancellationToken cancellationToken)
        {
            var currentUserId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (currentUserId != userId)
            {
                return BadRequest("Can't upload a picture for another user.");
            }

            var user = await _dbContext.Users.FirstOrDefaultAsync(a => a.Id == userId, cancellationToken);

            if (user == null)
            {
                return NotFound($"User with Id {userId} not found.");
            }

            using (var sourceFileStream = file.OpenReadStream())
            {
                var buffer = new byte[65536];

                long totalReadBytes = 0;
                int read;

                using (var destinationFileStream = new MemoryStream())
                {
                    while ((read = await sourceFileStream.ReadAsync(buffer, 0, buffer.Length)) > 0)
                    {
                        await destinationFileStream.WriteAsync(buffer, 0, read);
                        totalReadBytes += read;

                        if (totalReadBytes > MaxImageSizeByte)
                        {
                            return BadRequest("The size of the image exceeds the limit.");
                        }
                    }

                    user.ImageData = destinationFileStream.ToArray();
                }
            }

            var entry = _dbContext.Update(user);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return _mapper.Map<UserDto>(user);
        }

        [HttpGet("{userId}:image")]
        public async Task<IActionResult> GetImage(string userId)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(a => a.Id == userId);

            if (user == null)
            {
                return NotFound($"User with Id {userId} not found.");
            }

            if (user?.ImageData == null)
            {
                return NotFound($"User with Id {userId} has no image.");
            }

            return File(user.ImageData, "application/octet-stream", "image.png");
        }

        [HttpGet("@me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var dto = await GetUserAsDto(userId);

            if (dto == null)
            {
                return NotFound($"User with Id {userId} not found.");
            }

            return dto;
        }

        [HttpPost("{userId}:changeRoles")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<UserDto>> ChangeUserRoles(
            string userId,
            [FromBody] List<string> roles
            )
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound($"User with Id {userId} not found.");
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, userRoles);

            var result = await _userManager.AddToRolesAsync(user, roles);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return _mapper.Map<UserDto>(user);
        }

        // TODO: need something like user service for this kind of action
        private async Task<UserDto?> GetUserAsDto(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) { return null; }

            var roles = await _userManager.GetRolesAsync(user);

            var dto = _mapper.Map<UserDto>(user);

            dto.Roles = [.. roles];

            return dto;
        }
    }
}
