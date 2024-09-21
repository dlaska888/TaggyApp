using TaggyAppBackend.Api.Models.Repo;

namespace TaggyAppBackend.Api.Repos.Interfaces;

public interface IBlobRepo
{
    Task<string> GetBlobDownloadPath(string blobName, string containerName, string? friendlyName = null);
    Task<string> GetContainerDownloadPath(string containerName);
    Task<Stream> DownloadBlob(string blobName, string containerName);
    Task<BlobInfo> UploadBlob(string blobName, string containerName, Stream stream);
    Task<bool> DeleteBlob(string blobName, string containerName);
}