using TaggyAppBackend.Api.Models.Dtos.Tag;

namespace TaggyAppBackend.Api.Services.Interfaces;

public interface ITagService : IService<GetTagDto, CreateTagDto, UpdateTagDto>;