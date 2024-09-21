using TaggyAppBackend.Api.Models.Dtos.Tag;

namespace TaggyAppBackend.Api.Models.Dtos.File;

public class GetFileDto : GetDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string Url { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public long Size { get; set; }

    public string CreatorId { get; set; } = null!;
    public string GroupId { get; set; } = null!;
    public List<GetTagDto> Tags { get; set; } = [];
}