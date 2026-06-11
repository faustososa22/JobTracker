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
        public DbSet<ConversationMessage> ConversationMessages { get; set; }
        public DbSet<CvChunk> CvChunks { get; set; }
        public DbSet<EvaluationScore> EvaluationScores {get; set;}

       protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("vector");
            modelBuilder.Entity<CvChunk>()
                .Property(c => c.Embedding)
                .HasColumnType("vector(768)");
        }   

    }
}