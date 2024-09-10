using File = TaggyAppBackend.Api.Models.Entities.Master.File;

namespace TaggyAppBackend.Api.Helpers.Interfaces;

public interface IFileNameHelper
{
    string GetFileBlobName(File file);
}