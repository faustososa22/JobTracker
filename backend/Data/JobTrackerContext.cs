using JobTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Data
{
    public class JobTrackerContext : DbContext
    {
        public JobTrackerContext(DbContextOptions<JobTrackerContext> options) : base(options)
        {
        }

        public DbSet<Application> Applications { get; set; }
        public DbSet<AIAnalysis> AIAnalyses { get; set; }
        public DbSet<StatusHistory> StatusHistories { get; set; }
        public DbSet<User> Users { get; set; }
    }
}