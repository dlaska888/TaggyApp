namespace TaggyAppBackend.Api.Models.Dtos.Group;

public class UpdateGroupDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string PhotoId { get; set; } = null!;
}