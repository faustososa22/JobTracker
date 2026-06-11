namespace JobTracker.Models
{
    public class ConversationMessage
    {
        public int Id { get; set; }
        public string ConversationId { get; set; } = string.Empty;
        public int UserId { get; set; } 
        public string Role { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;

        public DateTimeOffset Timestamp { get; set; }
    }
}