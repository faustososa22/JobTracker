namespace JobTracker.Models
{
    public class EvaluationScore()
    {
        public int Id {get; set;}
        public float Relevance{get; set;}
        public float Grounding{get; set;}

        public float Actionability{get; set;}

        public float Tone{get; set;}

        public float Scope{get; set;}

        public float Average{get; set;}
        public string Question {get; set;} = string.Empty;
        public string Response {get; set;} = string.Empty;
        public DateTimeOffset CreatedAt {get; set;}
    }
}