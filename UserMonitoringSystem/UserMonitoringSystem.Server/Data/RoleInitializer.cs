using Microsoft.AspNetCore.Identity;
using UserMonitoringSystem.Server.Data.Entities;

namespace UserMonitoringSystem.Server.Data
{
    public static class RoleInitializer
    {
        public static async Task InitializeAsync(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            string adminEmail = "admin@admin.com";
            string password = "$Admin1";

            string adminRoleName = "admin";
            string userRoleName = "user";

            if (await roleManager.FindByNameAsync(adminRoleName) == null)
            {
                await roleManager.CreateAsync(new IdentityRole(adminRoleName));
            }

            if (await roleManager.FindByNameAsync(userRoleName) == null)
            {
                await roleManager.CreateAsync(new IdentityRole(userRoleName));
            }

            if (await userManager.FindByNameAsync(adminEmail) == null)
            {
                User adminUser = new() { Email = adminEmail, UserName = adminEmail };

                IdentityResult result = await userManager.CreateAsync(adminUser, password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, adminRoleName);
                }
            }
        }
    }
}
