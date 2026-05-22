using JobTracker.Models;

namespace JobTracker.Repositories
{
    public interface IApplicationRepository
    {
        Task<List<Application>> GetAllAsync();
        Task<Application?> GetByIdAsync(int id);
        Task<Application> CreateAsync(Application application);
        Task<Application> UpdateAsync(Application application);
        Task<bool> DeleteAsync(int id);
    }
}