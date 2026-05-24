using JobTracker.Data;
using JobTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Repositories
{
    public class StatusHistoryRepository : IStatusHistoryRepository
    {
        private readonly JobTrackerContext _context;

        public StatusHistoryRepository(JobTrackerContext context)
        {
            this._context = context;
        }
        public async Task<StatusHistory> CreateStatusHistoryAsync(StatusHistory statusHistory)
        {
            _context.StatusHistories.Add(statusHistory);
            await _context.SaveChangesAsync();
            return statusHistory;
        }

        public async Task<bool> DeleteStatusHistoryAsync(int id)
        {
            var statusHistory = await _context.StatusHistories.FindAsync(id);
            if (statusHistory == null) return false;

            _context.StatusHistories.Remove(statusHistory);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<StatusHistory>> GetAllStatusHistoriesAsync()
        {
            return await _context.StatusHistories.ToListAsync();
        }

        public async Task<List<StatusHistory>> GetStatusHistoryByApplicationIdAsync(int applicationId)
        {
            return await _context.StatusHistories.Where(sh => sh.ApplicationId == applicationId).ToListAsync();
        }

        public async Task<StatusHistory?> GetStatusHistoryByIdAsync(int id)
        {
            return await _context.StatusHistories.FindAsync(id);
        }
    }
}