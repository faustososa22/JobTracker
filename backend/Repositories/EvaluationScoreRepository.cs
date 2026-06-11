using JobTracker.Data;
using JobTracker.Models;

namespace JobTracker.Repositories
{
    public class EvaluationScoreRepository : IEvaluationScoreRepository
    {
        private readonly JobTrackerContext _context;

        public EvaluationScoreRepository(JobTrackerContext context)
        {
            this._context = context;
        }
        public async Task SaveAsync(EvaluationScore evaluationScore)
        {
            await _context.EvaluationScores.AddAsync(evaluationScore);
            await _context.SaveChangesAsync();
        }
    }
}