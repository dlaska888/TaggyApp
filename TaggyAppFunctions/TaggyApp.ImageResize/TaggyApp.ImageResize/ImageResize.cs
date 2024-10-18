using Imageflow.Fluent;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ImageResize;

public class ImageResize(ILoggerFactory loggerFactory)
{
    private readonly ILogger<ImageResize> _logger = loggerFactory.CreateLogger<ImageResize>();

    [Function(nameof(ImageResize))]
    [BlobOutput("taggy-app-thumbs/s-{name}.jpg")]
    public async Task<byte[]?> Run(
        [BlobTrigger("taggy-app-files/{name}.{extension}")]
        ReadOnlyMemory<byte> image,
        string name,
        string extension)
    {
        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType("." + extension, out var contentType))
            contentType = "application/octet-stream";

        if (contentType.StartsWith("image/") != true)
        {
            _logger.Log(LogLevel.Information,
                $"C# Blob trigger function Processed blob\n Name:{name} \n Size: {image.Length} Bytes");
            return null;
        }

        using var b = new ImageJob();
        var resized = new MemoryStream();
        await b.Decode(image.ToArray()).ResizerCommands("width=640&height=640&mode=crop&scale=both")
            .EncodeToStream(resized, true, new MozJpegEncoder(80)).Finish().InProcessAsync();

        _logger.Log(LogLevel.Information,
            $"C# Blob trigger function Processed blob\n Name:{image} \n Size: {image.Length} Bytes");

        return resized.ToArray();
    }
}