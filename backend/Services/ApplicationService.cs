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

        public async Task<bool> DeleteApplicationAsync(int id, int userId)
        {
            return await _applicationRepository.DeleteAsync(id, userId);
        }

        public async Task<List<Application>> GetAllApplicationsAsync(int userId)
        {
            return await _applicationRepository.GetAllAsync(userId);
        }

        public async Task<Application?> GetApplicationByIdAsync(int id, int userId)
        {
            return await _applicationRepository.GetByIdAsync(id, userId);
        }

        public async Task<Application> UpdateApplicationAsync(Application application, int userId)
        {
            application.AppliedDate = application.AppliedDate.ToUniversalTime();
            application.LastUpdated = application.LastUpdated.ToUniversalTime();
            return await _applicationRepository.UpdateAsync(application, userId);
        }
    }
}