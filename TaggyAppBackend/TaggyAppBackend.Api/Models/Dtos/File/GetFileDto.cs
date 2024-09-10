using TaggyAppBackend.Api.Models.Dtos.Tag;

namespace TaggyAppBackend.Api.Models.Dtos.File;

public class GetFileDto : GetDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string Path { get; set; } = null!;
    public string OwnerId { get; set; } = null!;
    public string OwnerName { get; set; } = null!;
    public string SasToken { get; set; } = null!;
    public List<GetTagDto> Tags { get; } = [];
}