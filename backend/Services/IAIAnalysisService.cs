using JobTracker.DTOs;

namespace JobTracker.Services
{
    public interface IAIAnalysisService
    {
        Task<CvMatchResults> CvMatchAsync(IFormFile? cvFile, string? cvText, string jobOfferText);
        Task<ApplicationInsightsResults> GetApplicationInsightsAsync(int applicationId, int userId);
    }
}