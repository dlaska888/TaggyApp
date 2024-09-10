using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.Extensions.Options;
using TaggyAppBackend.Api.Models.Options;
using TaggyAppBackend.Api.Repos.Interfaces;

namespace TaggyAppBackend.Api.Repos;

public class BlobRepo : IBlobRepo
{
    private readonly BlobContainerClient _container;
    private readonly AzureBlobOptions _options;

    public BlobRepo(IOptions<AzureBlobOptions> options)
    {
        _options = options.Value;
        var credentials = new StorageSharedKeyCredential(_options.StorageAccount, _options.Key);
        var serviceUri = new Uri($"https://{_options.StorageAccount}.blob.core.windows.net");
        var client = new BlobServiceClient(serviceUri, credentials);
        _container = client.GetBlobContainerClient(_options.Container);
    }

    public string GetBlobReadSasToken(string blobName)
    {
        return GetSasToken(blobName, BlobSasPermissions.Read);
    }

    public string GetBlobUploadSasToken(string blobName)
    {
        return GetSasToken(blobName, BlobSasPermissions.Write);
    }

    public async Task<bool> DeleteBlob(string path)
    {
        var blob = _container.GetBlobClient(path);
        return await blob.DeleteIfExistsAsync();
    }

    private string GetSasToken(string blobName, BlobSasPermissions permissions)
    {
        var blob = _container.GetBlobClient(blobName);
        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = _container.Name,
            BlobName = blob.Name,
            Resource = "b",
            StartsOn = DateTimeOffset.UtcNow,
            ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(15)
        };
        sasBuilder.SetPermissions(permissions);

        var sasQuery =
            sasBuilder.ToSasQueryParameters(new StorageSharedKeyCredential(_options.StorageAccount, _options.Key));

        var uriBuilder = new UriBuilder(blob.Uri)
        {
            Query = sasQuery.ToString()
        };

        return uriBuilder.ToString();
    }
}