using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserMonitoringSystem.Server.Models;

namespace UserMonitoringSystem.Server.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class WeatherForecastController(
        ILogger<WeatherForecastController> logger
        ) : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger = logger;

        private static readonly string[] Summaries =
        [
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        ];
        
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
                    return Enumerable.Range(1, rnd.Next(1, 4))
                    .Select(index => new WeatherForecastDto
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
