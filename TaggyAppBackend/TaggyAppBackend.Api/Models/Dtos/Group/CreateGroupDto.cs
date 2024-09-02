namespace TaggyAppBackend.Api.Models.Dtos.Group;

public class CreateGroupDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string PhotoId { get; set; } = null!;
}