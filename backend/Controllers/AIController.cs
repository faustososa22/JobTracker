using JobTracker.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly IAIAnalysisService _aiAnalysisService;

        public AIController(IAIAnalysisService aiAnalysisService)
        {
            this._aiAnalysisService = aiAnalysisService;
        }

        [HttpPost("cv-match")]
        public async Task<IActionResult> CvMatchAsync([FromForm] IFormFile? cvFile, [FromForm] string? cvText, [FromForm] string jobOfferText)
        {
            if (string.IsNullOrWhiteSpace(cvText) && cvFile == null)
                return BadRequest("Debe proveer el texto del CV o un archivo.");

            var result = await _aiAnalysisService.CvMatchAsync(cvFile, cvText, jobOfferText);
            return Ok(result);
        }

        [HttpGet("application-insights/{applicationId}")]
        public async Task<IActionResult> GetApplicationInsightsAsync(int applicationId)
        {
                var insights = await _aiAnalysisService.GetApplicationInsightsAsync(applicationId);
                return Ok(new { Insights = insights });
        }
    }
}