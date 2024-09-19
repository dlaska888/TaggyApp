using AutoMapper;
using TaggyAppBackend.Api.Models.Dtos.Account;
using TaggyAppBackend.Api.Models.Dtos.File;
using TaggyAppBackend.Api.Models.Dtos.Group;
using TaggyAppBackend.Api.Models.Dtos.GroupUser;
using TaggyAppBackend.Api.Models.Dtos.Tag;
using TaggyAppBackend.Api.Models.Entities;
using TaggyAppBackend.Api.Models.Entities.Master;
using File = TaggyAppBackend.Api.Models.Entities.Master.File;

namespace TaggyAppBackend.Api.AutoMapper;

public class DtoMappingProfile : Profile
{
    public DtoMappingProfile()
    {
        CreateMap<Group, GetGroupDto>()
            .ForMember(g => g.Users, opt =>
                opt.MapFrom((group, _, _, context) =>
                    group.GroupUsers.Select(ug => context.Mapper.Map<GetGroupUserDto>(ug))
                )
            );
        CreateMap<CreateGroupDto, Group>();
        CreateMap<UpdateGroupDto, Group>();

        CreateMap<GroupUser, GetGroupUserDto>()
            .ForMember(ug => ug.Name, opt => opt.MapFrom(ug => ug.User.UserName))
            .ForMember(ug => ug.Email, opt => opt.MapFrom(ug => ug.User.Email));
        CreateMap<CreateGroupUserDto, GroupUser>();
        CreateMap<UpdateGroupUserDto, GroupUser>();

        CreateMap<TaggyUser, GetAccountDto>();

        CreateMap<File, GetFileDto>()
            .ForMember(f => f.Name, opt => opt.MapFrom(f => f.UntrustedName))
            .ForMember(f => f.Tags, opt =>
                opt.MapFrom((file, _, _, context) =>
                    file.Tags.Select(t => context.Mapper.Map<GetTagDto>(t))
                )
            );
        CreateMap<CreateFileDto, File>()
            .ForMember(f => f.Tags, opt => opt.Ignore());
        CreateMap<UpdateFileDto, File>()
            .ForMember(f => f.UntrustedName, opt => opt.MapFrom(f => f.Name))
            .ForMember(f => f.Tags, opt => opt.Ignore());

        CreateMap<Tag, GetTagDto>();
        CreateMap<CreateTagDto, Tag>();
        CreateMap<UpdateTagDto, Tag>();
    }
}