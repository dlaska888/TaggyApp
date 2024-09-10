using System.ComponentModel.DataAnnotations;
using TaggyAppBackend.Api.Models.Dtos.Tag;

namespace TaggyAppBackend.Api.Models.Dtos.File;

public class CreateFileDto
{
    [Required][MaxLength(255)] public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public IEnumerable<CreateTagDto> Tags { get; set; } = [];
}