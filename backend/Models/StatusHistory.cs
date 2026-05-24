namespace JobTracker.Models
{
    public class StatusHistory
    {
        public int Id { get; set; }
        public Application? Application { get; set; }
        public int ApplicationId { get; set; }
        public ApplicationStatus Status { get; set; }
        public DateTimeOffset ChangedAt { get; set; }
        public string? Notes { get; set; }
    }
}