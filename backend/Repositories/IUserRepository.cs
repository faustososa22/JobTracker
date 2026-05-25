using JobTracker.Models;

namespace JobTracker.Repositories
{
    public interface IUserRepository
    {
        Task<bool> CreateUserAsync(User user);
        Task<User?> GetUserByEmailAsync(string email);
    }
}