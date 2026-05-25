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
    public class ApplicationsController: ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationsController(IApplicationService applicationService)
        {
            this._applicationService = applicationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var applications = await _applicationService.GetAllApplicationsAsync(GetUserId());
            return Ok(applications);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var application = await _applicationService.GetApplicationByIdAsync(id, GetUserId());
            if (application == null) return NotFound(new { message = "Application not found." });
            return Ok(application);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody]Application application)
        {
            application.UserId = GetUserId();
            var createdApplication = await _applicationService.CreateApplicationAsync(application);
            return CreatedAtAction(nameof(GetByIdAsync), new { id = createdApplication.Id }, createdApplication);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody]Application application)
        {
            if (id != application.Id) return BadRequest(new { message = "ID mismatch." });
            try
            {
                var updatedApplication = await _applicationService.UpdateApplicationAsync(application, GetUserId());
                return Ok(updatedApplication);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Application not found." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var success = await _applicationService.DeleteApplicationAsync(id, GetUserId());
            if (!success) return NotFound(new { message = "Application not found." });
            return NoContent();
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

    }
}