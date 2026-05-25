using JobTracker.Models;

namespace JobTracker.Repositories
{
    public interface IApplicationRepository
    {
        Task<List<Application>> GetAllAsync(int userId);
        Task<Application?> GetByIdAsync(int id, int userId);
        Task<Application> CreateAsync(Application application);
        Task<Application> UpdateAsync(Application application, int userId);
        Task<bool> DeleteAsync(int id, int userId);
    }
}