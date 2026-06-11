using System.Security.Claims;
using JobTracker.DTOs;
using JobTracker.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UglyToad.PdfPig;

namespace JobTracker.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly IAIAnalysisService _aiAnalysisService;
        private readonly ICvIndexService _cvIndexService;
        private readonly IEvaluationService _evaluationService;
        private readonly ICvMatchOrquestator _cvMatchOrquestator;

        public AIController(IAIAnalysisService aiAnalysisService, ICvIndexService cvIndexService, IEvaluationService evaluationService, ICvMatchOrquestator cvMatchOrquestator)
        {
            this._aiAnalysisService = aiAnalysisService;
            this._cvIndexService = cvIndexService;
            this._evaluationService = evaluationService;
            this._cvMatchOrquestator = cvMatchOrquestator;
        }

        [HttpPost("cv-match")]
        public async Task<IActionResult> CvMatchAsync([FromForm] IFormFile? cvFile, [FromForm] string? cvText, [FromForm] string jobOfferText)
        {
            if (string.IsNullOrWhiteSpace(cvText) && cvFile == null)
                return BadRequest("You must provide either a CV file or CV text.");

            try
            {
                
                if (cvFile != null)
                {
                    using var pdf = PdfDocument.Open(cvFile.OpenReadStream());
                    var extractedText = string.Join(" ", pdf.GetPages().Select(p => p.Text));
                    var result = await _cvMatchOrquestator.MatchAsync(extractedText, jobOfferText);
                    return Ok(result);
                }
                
                if (cvFile == null && !string.IsNullOrEmpty(cvText))
                {
                    var result = await _cvMatchOrquestator.MatchAsync(cvText, jobOfferText);
                    return Ok(result);
                }
            }catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            return BadRequest("Invalid request.");
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

        [HttpPost("index-cv")]
        public async Task<IActionResult> IndexCvAsync([FromBody] string cvText)
        {
            var userId = GetUserId();
            await _cvIndexService.IndexCvAsync(cvText, userId);
            return Ok(new { message = "CV indexed successfully" });
        }

        [HttpPost("job-coach-stream")]
        public async Task StreamJobCoachAsync([FromBody] JobCoachRequest request)
        {
            Response.Headers.Append("Content-Type", "text/event-stream");
            Response.Headers.Append("Cache-Control", "no-cache");
            Response.Headers.Append("Connection", "keep-alive");

            var userId = GetUserId();
            await foreach (var chunk in _aiAnalysisService.GetJobCoachStreamAsync(request.Question, userId, request.ConversationId))
            {
                var cleaned = chunk.StartsWith("#") ? "\n" + chunk : chunk;
                await Response.WriteAsync($"data: {cleaned.Replace("\n", "\\n")}\n\n");
                await Response.Body.FlushAsync();
            }
        }

        [HttpPost("evaluate")]
        public async Task<IActionResult> EvaluateAsync(EvaluationRequest evaluationRequest)
        {
            var response = await _evaluationService.EvaluateAsync(evaluationRequest.Question, evaluationRequest.Response);
            return Ok(response);
        }
        
        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}