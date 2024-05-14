using Microsoft.AspNetCore.Identity;

namespace UserMonitoringSystem.Server.Data.Entities
{
    public class User : IdentityUser
    {
        public int LoginCount { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public byte[]? ImageData { get; set; }
    }
}
