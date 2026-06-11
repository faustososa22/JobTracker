namespace JobTracker.Services
{
    public interface ICvIndexService
    {
        Task IndexCvAsync(string cvText, int userId);
        Task<List<string>> SearchCvAsync(string query, int userId);
    }
}