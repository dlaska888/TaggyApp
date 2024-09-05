using System.ComponentModel.DataAnnotations;

namespace TaggyAppBackend.Api.Models.Dtos.Tag;

public class CreateTagDto
{
    [MaxLength(255)]
    public string Name { get; set; } = null!;
}