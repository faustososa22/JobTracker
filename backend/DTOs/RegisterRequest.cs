using System.ComponentModel.DataAnnotations;

namespace JobTracke.DTOs
{
    public class RegisterRequest
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string LastName { get; set; }
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
        [Required]
        [MinLength(6)]
        public required string Password { get; set; }
    }
}