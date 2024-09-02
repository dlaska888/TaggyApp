using TaggyAppBackend.Api.Models.Dtos.Group;
using TaggyAppBackend.Api.Services.Interfaces;

namespace TaggyAppBackend.Api.Controllers;

public class Group(IGroupService service)
    : ResourceController<IGroupService, GetGroupDto, CreateGroupDto, UpdateGroupDto>(service);