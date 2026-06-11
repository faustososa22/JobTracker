using JobTracker.Data;
using JobTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Repositories
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly JobTrackerContext _context;

        public ConversationRepository(JobTrackerContext context)
        {
            this._context = context;
        }
        public async Task<List<ConversationMessage>> GetConversationHistoryAsync(string conversationId, int userId)
        {
            return await _context.ConversationMessages
                .Where(m => m.ConversationId == conversationId && m.UserId == userId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
        }

        public async Task SaveMessageAsync(ConversationMessage message)
        {
            _context.ConversationMessages.Add(message);
            await _context.SaveChangesAsync();
        }
    }

}