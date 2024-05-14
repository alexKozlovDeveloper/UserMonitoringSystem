namespace UserMonitoringSystem.Server.Models
{
    public class UserDto
    {
        public string Id { get; init; }   
        public string UserName { get; init; }
        public string? AvatarPath { get; set; }
        public int LoginCount { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }
}
