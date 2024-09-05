using System.ComponentModel.DataAnnotations;

namespace TaggyAppBackend.Api.Models.Dtos.Group;

public class UpdateGroupDto
{
    [MaxLength(255)]
    public string Name { get; set; } = null!;
    [MaxLength(255)]
    public string? Description { get; set; }
}