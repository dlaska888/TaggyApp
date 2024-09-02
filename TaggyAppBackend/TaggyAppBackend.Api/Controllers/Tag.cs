using TaggyAppBackend.Api.Models.Dtos.Tag;
using TaggyAppBackend.Api.Services.Interfaces;

namespace TaggyAppBackend.Api.Controllers;

public class Tag(ITagService service)
    : ResourceController<ITagService, GetTagDto, CreateTagDto, UpdateTagDto>(service);