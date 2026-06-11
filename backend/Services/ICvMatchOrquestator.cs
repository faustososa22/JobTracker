using JobTracker.DTOs;

namespace JobTracker.Services
{
    public interface ICvMatchOrquestator
    {
        Task<CvMatchResults> MatchAsync(string cvText, string jobOfferText);
    }
}