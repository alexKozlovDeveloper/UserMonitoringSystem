using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserMonitoringSystem.Server.Models;

namespace UserMonitoringSystem.Server.Controllers
{
    [ApiController]
    [Route("users")]
    public class UsersController(
        ApplicationDbContext dbContext,
        IMapper mapper
        )
    {
        private readonly ApplicationDbContext _dbContext = dbContext;
        private readonly IMapper _mapper = mapper;

        [Authorize]
        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            var users = await _dbContext.Users.ToListAsync();

            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<UserDto> GetUser(string id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(a => a.Id == id);

            if(user == null)
            {
                // TODO: handle 404
            }

            return _mapper.Map<UserDto>(user);
        }
    }
}
