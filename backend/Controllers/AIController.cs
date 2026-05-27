using System.Security.Claims;
using JobTracker.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Controllers
{
    [ApiController]
    [Authorize]
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
                return BadRequest("You must provide either a CV file or CV text.");

            try
            {
                var result = await _aiAnalysisService.CvMatchAsync(cvFile, cvText, jobOfferText);
                return Ok(result);
            }catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            
        }

        [HttpGet("application-insights/{applicationId}")]
        public async Task<IActionResult> GetApplicationInsightsAsync(int applicationId)
        {
            try
            {
                var insights = await _aiAnalysisService.GetApplicationInsightsAsync(applicationId, GetUserId());
                return Ok(insights);

            }catch(ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
                
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}