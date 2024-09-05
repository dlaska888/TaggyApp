using TaggyAppBackend.Api.Models.Dtos.Group;
using TaggyAppBackend.Api.Services.Interfaces;

namespace TaggyAppBackend.Api.Controllers.Group;

public class Group(IGroupService service)
    : ResourceController<IGroupService, GetGroupDto, CreateGroupDto, UpdateGroupDto>(service);