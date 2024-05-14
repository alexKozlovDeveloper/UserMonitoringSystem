using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using UserMonitoringSystem.Server.Models;

namespace UserMonitoringSystem.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [Authorize]
        [HttpGet]
        public IEnumerable<WeatherForecastDto> GetWeatherForecast()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecastDto
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [Authorize]
        [HttpGet("{year}")]
        public Dictionary<string, WeatherForecastDto[]> GetTemperatureByYear(int year)
        {
            var rnd = new Random(year);

            string[] months = 
            [
                "January", 
                "February", 
                "March", 
                "April",
                "May", 
                "June", 
                "July", 
                "August",
                "September", 
                "October", 
                "November", 
                "December"
            ];

            return months.ToDictionary(
                month => month, 
                month => 
                { 
                    return Enumerable.Range(1, rnd.Next(1, 4)).Select(index => new WeatherForecastDto
                    {
                        Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                        TemperatureC = rnd.Next(-20, 55),
                        Summary = Summaries[rnd.Next(Summaries.Length)]
                    })
                    .ToArray();
                }
            );
        }
    }
}
