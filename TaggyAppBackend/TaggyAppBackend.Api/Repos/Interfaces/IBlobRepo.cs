namespace TaggyAppBackend.Api.Repos.Interfaces;

public interface IBlobRepo
{
    string GetBlobReadSasToken(string blobName);
    string GetBlobUploadSasToken(string blobName);
    Task<bool> DeleteBlob(string path);
}