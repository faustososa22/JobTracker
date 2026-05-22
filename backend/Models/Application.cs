namespace JobTracker.Models
{
    public class Application
    {
        public int Id { get; set; }
        public required string CompanyName { get; set; }
        public required string JobTitle { get; set; }
        public required string Description { get; set; }
        public DateTimeOffset AppliedDate { get; set; }
        public DateTimeOffset LastUpdated { get; set; }
        public ApplicationStatus Status { get; set; }
    }

}