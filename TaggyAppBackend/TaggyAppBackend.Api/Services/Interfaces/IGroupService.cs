using TaggyAppBackend.Api.Models.Dtos.Group;

namespace TaggyAppBackend.Api.Services.Interfaces;

public interface IGroupService : IService<GetGroupDto, CreateGroupDto, UpdateGroupDto>;
