using Pgvector;

namespace JobTracker.Models
{
    public class CvChunk
    {
        public Guid Id { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public Vector Embedding { get; set; } = null!;
    }
}