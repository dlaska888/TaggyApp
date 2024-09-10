using TaggyAppBackend.Api.Helpers.Interfaces;
using File = TaggyAppBackend.Api.Models.Entities.Master.File;

namespace TaggyAppBackend.Api.Helpers;

public class FileNameHelper : IFileNameHelper
{
    public string GetFileBlobName(File file)
    {
        return $"{file.GroupId}/{file.Id}";
    }
}