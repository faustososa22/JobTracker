using JobTracker.DTOs;

namespace JobTracker.Services
{
    public interface IAIAnalysisService
    {
        Task<ApplicationInsightsResults> GetApplicationInsightsAsync(int applicationId, int userId);
        IAsyncEnumerable<string> GetJobCoachStreamAsync(string question, int userId, string conversationId);
    }
}