namespace TaggyAppBackend.Api.Models.Dtos.File;

public class UpdateFileDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}