using JobTracker.Models;
using JobTracker.Repositories;

namespace JobTracker.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IStatusHistoryRepository _statusHistoryRepository;

        public ApplicationService(IApplicationRepository applicationRepository, IStatusHistoryRepository statusHistoryRepository)
        {
            this._applicationRepository = applicationRepository;
            this._statusHistoryRepository = statusHistoryRepository;
        }
        public async Task<Application> CreateApplicationAsync(Application application)
        {
            application.AppliedDate = application.AppliedDate.ToUniversalTime();
            application.LastUpdated = application.LastUpdated.ToUniversalTime();
            
            var created = await _applicationRepository.CreateAsync(application);

            await _statusHistoryRepository.CreateStatusHistoryAsync(new StatusHistory
            {
                ApplicationId = created.Id,
                Status = created.Status,
                ChangedAt = DateTimeOffset.UtcNow,
                Notes = "Application created"
            });

            return created;
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