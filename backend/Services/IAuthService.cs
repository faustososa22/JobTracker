using JobTracker.Models;

namespace JobTracker.Services
{
    public interface IAuthService
    {
        Task<string?> Login(string email, string password);
        Task<string?> Register(User user);
    }
}