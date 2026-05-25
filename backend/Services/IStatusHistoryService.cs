using JobTracker.Models;

namespace JobTracker.Services
{
    public interface IStatusHistoryService
    {
        Task<List<StatusHistory>> GetAllStatusHistoriesAsync();
        Task<StatusHistory?> GetStatusHistoryByIdAsync(int id);
        Task<List<StatusHistory>> GetStatusHistoryByApplicationIdAsync(int applicationId);
        Task<StatusHistory> CreateStatusHistoryAsync(StatusHistory statusHistory);
        Task<bool> DeleteStatusHistoryAsync(int id);
    }
}