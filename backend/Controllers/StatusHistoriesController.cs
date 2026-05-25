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

        public StatusHistoriesController(IStatusHistoryService statusHistoryService)
        {
            this._statusHistoryService = statusHistoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var statusHistories = await _statusHistoryService.GetAllStatusHistoriesAsync();
            return Ok(statusHistories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var statusHistory = await _statusHistoryService.GetStatusHistoryByIdAsync(id);
            if (statusHistory == null) return NotFound();
            return Ok(statusHistory);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody]StatusHistory statusHistory)
        {
            var createdStatusHistory = await _statusHistoryService.CreateStatusHistoryAsync(statusHistory);
            return CreatedAtAction(nameof(GetByIdAsync), new { id = createdStatusHistory.Id }, createdStatusHistory);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var success = await _statusHistoryService.DeleteStatusHistoryAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}