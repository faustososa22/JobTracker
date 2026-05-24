using JobTracker.Models;

namespace JobTracker.Services
{
    public interface IStatusHistoryService
    {
        Task<List<StatusHistory>> GetAllStatusHistoriesAsync();
        Task<StatusHistory?> GetStatusHistoryByIdAsync(int id);
        Task<StatusHistory> CreateStatusHistoryAsync(StatusHistory statusHistory);
        Task<bool> DeleteStatusHistoryAsync(int id);
    }
}