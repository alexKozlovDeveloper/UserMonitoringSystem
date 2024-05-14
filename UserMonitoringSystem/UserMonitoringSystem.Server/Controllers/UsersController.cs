﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            var users = await _dbContext.Users.ToListAsync();

            var user = await userManager.FindByIdAsync(users.First().Id);

            //var d = await userManager.GetLoginsAsync(user);

            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        [HttpGet("{userId}")]
        public async Task<UserDto> GetUser(string userId, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(a => a.Id == userId, cancellationToken);

            if(user == null)
            {
                // TODO: handle 404
            }

            return _mapper.Map<UserDto>(user);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{userId}")]
        public async Task<UserDto> DeleteUser(string userId, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(a => a.Id == userId, cancellationToken);

            if (user == null)
            {
                // TODO: handle 404
            }

            var entry = _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return _mapper.Map<UserDto>(user);
        }

        [HttpPost("/{userId}/uploadImage")]
        [Consumes("multipart/form-data")]
        public async Task<UserDto> UploadFileAsync(string userId, IFormFile file, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(a => a.Id == userId, cancellationToken);

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

                        Console.WriteLine("loading...");

                        if(totalReadBytes > 10_000_000)
                        {

                        }
                    }

                    user.ImageData = destinationFileStream.ToArray();
                }
            }

            var entry = _dbContext.Update(user);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return _mapper.Map<UserDto>(user);
        }

        [HttpGet("/{userId}:image")]
        public async Task<IActionResult> GetImage(string userId, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(a => a.Id == userId, cancellationToken);

            return File(user.ImageData, "application/octet-stream", "image.png");                       
        }
    }
}