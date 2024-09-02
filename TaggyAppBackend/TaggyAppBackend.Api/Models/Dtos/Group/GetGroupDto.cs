using TaggyAppBackend.Api.Models.Dtos.Account;

namespace TaggyAppBackend.Api.Models.Dtos.Group;

public class GetGroupDto : GetDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string PhotoId { get; set; } = null!;
    public IEnumerable<GetUserGroupDto> Users { get; set; } = [];
}