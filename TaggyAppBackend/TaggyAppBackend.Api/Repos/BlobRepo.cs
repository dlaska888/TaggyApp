using System.Collections;
using System.Text;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using TaggyAppBackend.Api.Models.Options;
using TaggyAppBackend.Api.Repos.Interfaces;

namespace TaggyAppBackend.Api.Repos
{
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

        public async Task<bool> UploadFileToBlobAsync(Stream fileStream, string fileName)
        {
            const int blockSize = 1024 * 1024 * 4; // 4MB
            var blobClient = _container.GetBlockBlobClient(Guid.NewGuid().ToString());

            var blockIdArrayList = new ArrayList();
            int bytesRead;
            long totalBytesUploaded = 0;

            // Buffer for each block
            var buffer = new byte[blockSize];

            // Read from the stream until no more data is available
            while ((bytesRead = await fileStream.ReadAsync(buffer, 0, blockSize)) > 0)
            {
                using (var memoryStream = new MemoryStream(buffer, 0, bytesRead))
                {
                    var blockId = Convert.ToBase64String(Encoding.UTF8.GetBytes(Guid.NewGuid().ToString()));
                    blockIdArrayList.Add(blockId);
                    await blobClient.StageBlockAsync(blockId, memoryStream);
                }

                // Increment the total bytes uploaded
                totalBytesUploaded += bytesRead;
            }

            // Convert ArrayList to string array
            var blockIdArray = (string[])blockIdArrayList.ToArray(typeof(string));

            // Commit the block list
            await blobClient.CommitBlockListAsync(blockIdArray);

            return true;
        }


        public string GetContainerReadSasToken()
        {
            return GetContainerSasToken(BlobContainerSasPermissions.Read);
        }

        public string GetBlobReadSasToken(string blobName)
        {
            return GetBlobSasToken(blobName, BlobSasPermissions.Read);
        }

        public string GetContainerCreateSasToken()
        {
            return GetContainerSasToken(BlobContainerSasPermissions.Create);
        }

        public string GetBlobDeleteSasToken(string blobName)
        {
            return GetBlobSasToken(blobName, BlobSasPermissions.Delete);
        }

        public async Task<bool> DeleteBlob(string path)
        {
            var blob = _container.GetBlobClient(path);
            return await blob.DeleteIfExistsAsync();
        }

        private string GetContainerSasToken(BlobContainerSasPermissions permissions)
        {
            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = _container.Name,
                Resource = "c",

                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(15)
            };
            sasBuilder.SetPermissions(permissions);

            var sasQuery =
                sasBuilder.ToSasQueryParameters(
                    new StorageSharedKeyCredential(_options.StorageAccount, _options.Key));

            var uriBuilder = new UriBuilder(_container.Uri)
            {
                Query = sasQuery.ToString()
            };

            return uriBuilder.ToString();
        }

        // Helper method for generating SAS tokens for an individual blob
        private string GetBlobSasToken(string blobName, BlobSasPermissions permissions)
        {
            var blob = _container.GetBlobClient(blobName);
            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = _container.Name,
                BlobName = blob.Name,
                Resource = "b",
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(15)
            };
            sasBuilder.SetPermissions(permissions);

            var sasQuery =
                sasBuilder.ToSasQueryParameters(
                    new StorageSharedKeyCredential(_options.StorageAccount, _options.Key));

            var uriBuilder = new UriBuilder(blob.Uri)
            {
                Query = sasQuery.ToString()
            };

            return uriBuilder.ToString();
        }
    }
}