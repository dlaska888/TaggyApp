using Microsoft.AspNetCore.WebUtilities;

namespace TaggyAppBackend.Api.Repos.Interfaces;

public interface IBlobRepo
{
    string GetContainerReadSasToken();
    string GetBlobReadSasToken(string blobName);
    Task<bool> UploadFileToBlobAsync(Stream stream, string fileName);
    string GetContainerCreateSasToken();
    string GetBlobDeleteSasToken(string blobName);
    Task<bool> DeleteBlob(string path);
}