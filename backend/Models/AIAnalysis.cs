namespace JobTracker.Models
{
    public class AIAnalysis
    {
        public int Id { get; set; }
        public required Application Application{ get; set; }
        public int ApplicationId { get; set; }
        public required string Recommendation { get; set; } 
        public decimal? MatchScore { get; set; }
        public DateTimeOffset AnalyzedAt { get; set; }
    }
}