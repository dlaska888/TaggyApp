using AutoMapper;
using TaggyAppBackend.Api.Models.Dtos.Group;
using TaggyAppBackend.Api.Models.Enums;
using TaggyAppBackend.Api.Providers;

namespace TaggyAppBackend.Api.AutoMapper.ValueResolvers.Group;

public class CurrentUserGroupRole : IValueResolver<Models.Entities.Master.Group, GetGroupDto, GroupRole>
{
    private readonly string _userId;

    public CurrentUserGroupRole(IAuthContextProvider contextProvider)
    {
        _userId = contextProvider.GetUserId();
    }

    public GroupRole Resolve(Models.Entities.Master.Group source, GetGroupDto destination, GroupRole destMember,
        ResolutionContext context)
    {
        var groupUser = source.GroupUsers.SingleOrDefault(gu => gu.UserId == _userId);
        return groupUser!.Role;
    }
}