using JobTracker.Data;
using JobTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly JobTrackerContext _context;

        public ApplicationRepository(JobTrackerContext context)
        {
            this._context = context;
        }
        public async Task<Application> CreateAsync(Application application)
        {
            _context.Applications.Add(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var application = await _context.Applications.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
            if (application == null) return false;

            _context.Applications.Remove(application);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Application>> GetAllAsync(int userId)
        {
            return await _context.Applications.Where(a => a.UserId == userId).ToListAsync();
        }

        public async Task<Application?> GetByIdAsync(int id, int userId)
        {
            return await _context.Applications.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        }

        public async Task<Application> UpdateAsync(Application application, int userId)
        {
            var existingApplication = await _context.Applications.FirstOrDefaultAsync(a => a.Id == application.Id && a.UserId == userId);
            if (existingApplication == null) throw new Exception("Application not found or access denied.");
            existingApplication.CompanyName = application.CompanyName;
            existingApplication.JobTitle = application.JobTitle;
            existingApplication.Description = application.Description;
            existingApplication.Status = application.Status;
            existingApplication.LastUpdated = application.LastUpdated;
            await _context.SaveChangesAsync();
            return existingApplication;
        }
    }
}