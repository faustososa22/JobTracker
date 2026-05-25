using JobTracker.Models;

namespace JobTracker.Services
{
    public interface IApplicationService
    {
        Task<List<Application>> GetAllApplicationsAsync(int userId);
        Task<Application?> GetApplicationByIdAsync(int id, int userId);
        Task<Application> CreateApplicationAsync(Application application);
        Task<Application> UpdateApplicationAsync(Application application, int userId);
        Task<bool> DeleteApplicationAsync(int id, int userId);
    }
}