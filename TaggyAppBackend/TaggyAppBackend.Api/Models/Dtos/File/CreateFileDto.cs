using System.ComponentModel.DataAnnotations;

namespace TaggyAppBackend.Api.Models.Dtos.File;

public class CreateFileDto
{
    [Required]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}