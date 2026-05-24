namespace JobTracker.Dtos
{
    public class CvMatchResults
    {
        public int MatchScore { get; set; }
        public string Summary { get; set; } = string.Empty;
        public List<string> Strengths { get; set; } = [];
        public List<string> Weaknesses { get; set; } = [];
        public List<string> Suggestions { get; set; } = [];
    }
}