using JobTracker.Models;
using JobTracker.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.Controllers
{
    [ApiController]
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
            var applications = await _applicationService.GetAllApplicationsAsync();
            return Ok(applications);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var application = await _applicationService.GetApplicationByIdAsync(id);
            if (application == null) return NotFound();
            return Ok(application);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody]Application application)
        {
            var createdApplication = await _applicationService.CreateApplicationAsync(application);
            return CreatedAtAction(nameof(GetByIdAsync), new { id = createdApplication.Id }, createdApplication);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody]Application application)
        {
            if (id != application.Id) return BadRequest();
            var updatedApplication = await _applicationService.UpdateApplicationAsync(application);
            return Ok(updatedApplication);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var success = await _applicationService.DeleteApplicationAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

    }
}