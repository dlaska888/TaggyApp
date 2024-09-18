using TaggyAppBackend.Api.Models.Dtos.Tag;

namespace TaggyAppBackend.Api.Models.Dtos.File;

public class GetFileDto : GetDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string DownloadPath { get; set; } = null!;
    public string CreatorId { get; set; } = null!;
    public string GroupId { get; set; } = null!;
    public List<GetTagDto> Tags { get; } = [];
}