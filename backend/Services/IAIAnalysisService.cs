using JobTracker.Dtos;

namespace JobTracker.Services
{
    public interface IAIAnalysisService
    {
        Task<CvMatchResults> CvMatchAsync(IFormFile? cvFile, string? cvText, string jobOfferText);
    }
}