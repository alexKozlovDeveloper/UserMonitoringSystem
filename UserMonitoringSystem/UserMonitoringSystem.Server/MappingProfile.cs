using AutoMapper;
using UserMonitoringSystem.Server.Data.Entities;
using UserMonitoringSystem.Server.Models;

namespace UserMonitoringSystem.Server
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
        }
    }
}
