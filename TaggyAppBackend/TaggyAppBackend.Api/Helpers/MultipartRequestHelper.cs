using Microsoft.Net.Http.Headers;

namespace TaggyAppBackend.Api.Helpers;

public static class MultipartRequestHelper
{
    // Get boundary from content type
    public static string GetBoundary(MediaTypeHeaderValue contentType, int lengthLimit)
    {
        var boundary = HeaderUtilities.RemoveQuotes(contentType.Boundary).Value;

        if (string.IsNullOrWhiteSpace(boundary))
        {
            throw new InvalidDataException("Missing content-type boundary.");
        }

        if (boundary.Length > lengthLimit)
        {
            throw new InvalidDataException($"Multipart boundary length limit {lengthLimit} exceeded.");
        }

        return boundary;
    }

    public static bool HasFormDataContentDisposition(ContentDispositionHeaderValue? contentDisposition)
    {
        return contentDisposition != null && contentDisposition.DispositionType.Equals("form-data") &&
               string.IsNullOrEmpty(contentDisposition.FileName.Value) &&
               string.IsNullOrEmpty(contentDisposition.FileNameStar.Value);
    }

    public static bool HasFileContentDisposition(ContentDispositionHeaderValue? contentDisposition)
    {
        return contentDisposition != null && contentDisposition.DispositionType.Equals("form-data") &&
               (!string.IsNullOrEmpty(contentDisposition.FileName.Value) ||
                !string.IsNullOrEmpty(contentDisposition.FileNameStar.Value));
    }
}