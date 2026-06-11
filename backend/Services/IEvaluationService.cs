using JobTracker.DTOs;

namespace JobTracker.Services
{
    public interface IEvaluationService
    {
        Task<EvaluationResult> EvaluateAsync(string question, string response);
    }
}