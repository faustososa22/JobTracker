using JobTracker.Models;
using JobTracker.Repositories;

namespace JobTracker.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;

        public ApplicationService(IApplicationRepository applicationRepository)
        {
            this._applicationRepository = applicationRepository;
        }
        public async Task<Application> CreateApplicationAsync(Application application)
        {
            application.AppliedDate = application.AppliedDate.ToUniversalTime();
            application.LastUpdated = application.LastUpdated.ToUniversalTime();
            return await _applicationRepository.CreateAsync(application);
        }

        public async Task<bool> DeleteApplicationAsync(int id)
        {
            return await _applicationRepository.DeleteAsync(id);
        }

        public async Task<List<Application>> GetAllApplicationsAsync()
        {
            return await _applicationRepository.GetAllAsync();
        }

        public async Task<Application?> GetApplicationByIdAsync(int id)
        {
            return await _applicationRepository.GetByIdAsync(id);
        }

        public async Task<Application> UpdateApplicationAsync(Application application)
        {
            application.AppliedDate = application.AppliedDate.ToUniversalTime();
            application.LastUpdated = application.LastUpdated.ToUniversalTime();
            return await _applicationRepository.UpdateAsync(application);
        }
    }
}