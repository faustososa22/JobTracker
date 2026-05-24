using JobTracker.Models;
using JobTracker.Repositories;

namespace JobTracker.Services
{
    public class StatusHistoryService : IStatusHistoryService
    {
        private readonly IStatusHistoryRepository _statusHistoryRepository;

        public StatusHistoryService(IStatusHistoryRepository statusHistoryRepository)
        {
            this._statusHistoryRepository = statusHistoryRepository;
        }
        public async Task<StatusHistory> CreateStatusHistoryAsync(StatusHistory statusHistory)
        {
            statusHistory.ChangedAt = statusHistory.ChangedAt.ToUniversalTime();
            return await _statusHistoryRepository.CreateStatusHistoryAsync(statusHistory);
        }

        public async Task<bool> DeleteStatusHistoryAsync(int id)
        {
            return await _statusHistoryRepository.DeleteStatusHistoryAsync(id);
        }

        public async Task<List<StatusHistory>> GetAllStatusHistoriesAsync()
        {
            return await _statusHistoryRepository.GetAllStatusHistoriesAsync();
        }

        public async Task<StatusHistory?> GetStatusHistoryByIdAsync(int id)
        {
            return await _statusHistoryRepository.GetStatusHistoryByIdAsync(id);
        }
    }
}