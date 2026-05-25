using System.Security.Claims;
using JobTracker.Models;
using JobTracker.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class StatusHistoriesController: ControllerBase
    {
        private readonly IStatusHistoryService _statusHistoryService;
        private readonly IApplicationService _applicationService;

        public StatusHistoriesController(IStatusHistoryService statusHistoryService, IApplicationService applicationService)
        {
            this._statusHistoryService = statusHistoryService;
            this._applicationService = applicationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync([FromQuery] int applicationId)
        {
            var application = await _applicationService.GetApplicationByIdAsync(applicationId, GetUserId());
            if (application == null) return NotFound(new { message = "Application not found." });

            var statusHistories = await _statusHistoryService.GetStatusHistoryByApplicationIdAsync(applicationId);
            return Ok(statusHistories);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var statusHistory = await _statusHistoryService.GetStatusHistoryByIdAsync(id);
            if (statusHistory == null) return NotFound(new { message = "Status history not found." });

            var application = await _applicationService.GetApplicationByIdAsync(statusHistory.ApplicationId, GetUserId());
            if (application == null) return Forbid();

            return Ok(statusHistory);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody]StatusHistory statusHistory)
        {
            var application = await _applicationService.GetApplicationByIdAsync(statusHistory.ApplicationId, GetUserId());
            if (application == null) return NotFound(new { message = "Application not found." });
            var createdStatusHistory = await _statusHistoryService.CreateStatusHistoryAsync(statusHistory);
            return CreatedAtAction(nameof(GetByIdAsync), new { id = createdStatusHistory.Id }, createdStatusHistory);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var statusHistory = await _statusHistoryService.GetStatusHistoryByIdAsync(id);
            if (statusHistory == null) return NotFound(new { message = "Status history not found." });

            var application = await _applicationService.GetApplicationByIdAsync(statusHistory.ApplicationId, GetUserId());
            if (application == null) return Forbid();

            await _statusHistoryService.DeleteStatusHistoryAsync(id);
            return NoContent();
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}