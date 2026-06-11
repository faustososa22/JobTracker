using JobTracker.Models;

namespace JobTracker.Repositories
{
    public interface IEvaluationScoreRepository
    {
        public Task SaveAsync(EvaluationScore evaluationScore);
    }
}