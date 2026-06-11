namespace JobTracker.DTOs
{
    public class EvaluationResult
    {
        public float Relevance{get; set;}
        public float Grounding{get; set;}

        public float Actionability{get; set;}

        public float Tone{get; set;}

        public float Scope{get; set;}

        public float Average{get; set;}
        
        
    }
}