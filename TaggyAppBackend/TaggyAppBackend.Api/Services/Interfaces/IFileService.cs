using TaggyAppBackend.Api.Models.Dtos.File;

namespace TaggyAppBackend.Api.Services.Interfaces;

public interface IFileService : IService<GetFileDto, CreateFileDto, UpdateFileDto>;
