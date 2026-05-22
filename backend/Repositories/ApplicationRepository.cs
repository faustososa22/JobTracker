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

        public async Task<bool> DeleteAsync(int id)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application == null) return false;

            _context.Applications.Remove(application);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Application>> GetAllAsync()
        {
            return await _context.Applications.ToListAsync();
        }

        public async Task<Application?> GetByIdAsync(int id)
        {
            return await _context.Applications.FindAsync(id);
        }

        public async Task<Application> UpdateAsync(Application application)
        {
            _context.Applications.Update(application);
            await _context.SaveChangesAsync();
            return application;
        }
    }
}