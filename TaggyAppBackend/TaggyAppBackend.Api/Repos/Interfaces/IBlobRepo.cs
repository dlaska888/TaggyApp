namespace TaggyAppBackend.Api.Repos.Interfaces;

public interface IBlobRepo
{
    Task<Stream> DownloadBlob(string blobName, string containerName);
    Task<long> UploadBlob(string blobName, string containerName, Stream stream);
    Task<bool> DeleteBlob(string blobName, string containerName);
}