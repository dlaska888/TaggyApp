using System.Buffers;
using System.Collections;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks.Dataflow;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Options;
using TaggyAppBackend.Api.Models.Options;
using TaggyAppBackend.Api.Repos.Interfaces;

namespace TaggyAppBackend.Api.Repos;

public class BlobRepo : IBlobRepo
{
    private readonly AzureBlobOptions _options;
    private readonly BlobServiceClient _client;

    public BlobRepo(IOptions<AzureBlobOptions> options)
    {
        _options = options.Value;
        var credentials = new StorageSharedKeyCredential(_options.StorageAccount, _options.Key);
        var serviceUri = new Uri($"https://{_options.StorageAccount}.blob.core.windows.net");
        _client = new BlobServiceClient(serviceUri, credentials);
    }

    public async Task<Stream> DownloadBlob(string blobName, string containerName)
    {
        var container = await GetContainer(containerName);
        var blob = container.GetBlobClient(blobName);
        return await blob.OpenReadAsync();
    }

    public async Task<long> UploadBlob(string blobName, string containerName, Stream stream)
    {
        var container = await GetContainer(containerName);
        var blobClient = container.GetBlockBlobClient(blobName);
        var maxParallelConsume = _options.MaxParallelism;

        var buffer = new BufferBlock<Block>(new DataflowBlockOptions
            { BoundedCapacity = maxParallelConsume });

        var consumerBlock = new ActionBlock<Block>(
            block => StageBlock(block, blobClient),
            new ExecutionDataflowBlockOptions
            {
                BoundedCapacity = maxParallelConsume,
                MaxDegreeOfParallelism = maxParallelConsume
            });

        buffer.LinkTo(consumerBlock, new DataflowLinkOptions
            { PropagateCompletion = true });

        var producerTask = Produce(buffer, stream);
        await consumerBlock.Completion;

        var producerResult = await producerTask;

        if (producerResult.TotalBytesUploaded == -1)
            return -1;

        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(blobName, out var contentType))
            contentType = "application/octet-stream";

        var headers = new BlobHttpHeaders
        {
            ContentType = contentType,
            ContentHash = producerResult.Hash
        };

        await blobClient.CommitBlockListAsync(producerResult.BlockIds, headers);
        return producerResult.TotalBytesUploaded;
    }

    public async Task<bool> DeleteBlob(string blobName, string containerName)
    {
        var container = await GetContainer(containerName);
        var blob = container.GetBlobClient(blobName);

        return await blob.DeleteIfExistsAsync();
    }

    private async Task<BlobContainerClient> GetContainer(string containerName)
    {
        var container = _client.GetBlobContainerClient(containerName);
        if (!await container.ExistsAsync())
        {
            await container.CreateAsync();
        }

        return container;
    }

    private record Block(string Id, byte[] Data, int Length);

    private record ProducerResult(IReadOnlyCollection<string> BlockIds, long TotalBytesUploaded, byte[]? Hash);

    private async Task<ProducerResult> Produce(ITargetBlock<Block> target,
        Stream file)
    {
        var blockIds = new List<string>();
        var blockSize = _options.BlockSize;
        var totalBytesUploaded = 0L;

        using var md5 = MD5.Create();

        while (true)
        {
            var buffer = ArrayPool<byte>.Shared.Rent(blockSize);
            var read = await file.ReadAsync(buffer);

            if (read == 0) break;

            md5.TransformBlock(buffer, 0, read, null, 0);

            totalBytesUploaded += read;
            if (totalBytesUploaded > _options.MaxBlobSize)
            {
                target.Complete();
                return new ProducerResult(blockIds, -1, null);
            }

            var blockId = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            blockIds.Add(blockId);
            await target.SendAsync(new Block(blockId, buffer, read));
        }

        //add invalid value to hash
        md5.TransformFinalBlock([], 0, 0);

        target.Complete();
        return new ProducerResult(blockIds, totalBytesUploaded, md5.Hash);
    }

    private async Task StageBlock(Block block, BlockBlobClient blobClient)
    {
        using var ms = new MemoryStream(block.Data, 0, block.Length);
        await blobClient.StageBlockAsync(block.Id, ms);
    }
}