using AutoMapper;
using Microsoft.AspNetCore.Identity;
using UserMonitoringSystem.Server.Models;

namespace UserMonitoringSystem.Server
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<IdentityUser, UserDto>();
        }
    }
}
