using JobTracker.Models;

namespace JobTracker.Repositories
{
    public interface IStatusHistoryRepository
    {
        Task <List<StatusHistory>> GetAllStatusHistoriesAsync();
        Task<StatusHistory?> GetStatusHistoryByIdAsync(int id);
        Task<StatusHistory> CreateStatusHistoryAsync(StatusHistory statusHistory);
        Task<bool> DeleteStatusHistoryAsync(int id);
        Task<List<StatusHistory>> GetStatusHistoryByApplicationIdAsync(int applicationId);
    }
}