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
        public async Task<IActionResult> CvMatchAsync([FromForm] string? cvText, [FromForm] string jobOfferText)
        {
            if (string.IsNullOrWhiteSpace(cvText))
                return BadRequest("Debe proveer el texto del CV.");

            var result = await _aiAnalysisService.CvMatchAsync(null, cvText, jobOfferText);
            return Ok(result);
        }
    }
}