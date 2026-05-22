using JobTracker.Models;

namespace JobTracker.Services
{
    public interface IApplicationService
    {
        Task<List<Application>> GetAllApplicationsAsync();
        Task<Application?> GetApplicationByIdAsync(int id);
        Task<Application> CreateApplicationAsync(Application application);
        Task<Application> UpdateApplicationAsync(Application application);
        Task<bool> DeleteApplicationAsync(int id);
    }
}