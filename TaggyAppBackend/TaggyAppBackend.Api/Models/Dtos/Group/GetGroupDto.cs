using Sieve.Attributes;
using TaggyAppBackend.Api.Models.Dtos.GroupUser;

namespace TaggyAppBackend.Api.Models.Dtos.Group;

public class GetGroupDto : GetDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public IEnumerable<GetGroupUserDto> Users { get; set; } = [];
}