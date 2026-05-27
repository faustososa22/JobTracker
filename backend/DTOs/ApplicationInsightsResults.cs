namespace JobTracker.DTOs
{
    public class ApplicationInsightsResults
    {
        public string Overview { get; set; } = string.Empty;
        public string WhatToExpect { get; set; } = string.Empty;
        public List<string> Recommendations { get; set; } = new();
    }
}