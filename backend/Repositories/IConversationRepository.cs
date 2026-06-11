using JobTracker.Models;

namespace JobTracker.Repositories
{
    public interface IConversationRepository
    {
        Task SaveMessageAsync(ConversationMessage message);
        Task<List<ConversationMessage>> GetConversationHistoryAsync(string conversationId, int userId);
    }
}