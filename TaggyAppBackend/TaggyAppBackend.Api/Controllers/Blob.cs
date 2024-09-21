using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using TaggyAppBackend.Api.Exceptions;
using TaggyAppBackend.Api.Helpers;
using TaggyAppBackend.Api.Models.Dtos.File;
using TaggyAppBackend.Api.Models.Options;
using TaggyAppBackend.Api.Repos.Interfaces;

namespace TaggyAppBackend.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class Blob(IBlobRepo blobRepo, IOptions<AzureBlobOptions> options) : ControllerBase
    {
        [HttpPost("upload-block")]
        public async Task<IActionResult> UploadFileInBlocks()
        {
            // Create a MultipartReader to parse the request
            var boundary = MultipartRequestHelper.GetBoundary(
                MediaTypeHeaderValue.Parse(Request.ContentType),
                FormOptions.DefaultMultipartBoundaryLengthLimit);

            var reader = new MultipartReader(boundary, Request.Body, options.Value.BlockSize);

            CreateFileDto? dto = null;
            FileMultipartSection? fileSection = null;

            while (await reader.ReadNextSectionAsync() is { } section)
            {
                // Process the form data part
                if (!ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out var contentDisposition))
                    continue;

                if (MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
                {
                    // This is the file section, process it as a stream without loading into memory
                    fileSection = section.AsFileSection();
                    break;
                }

                if (MultipartRequestHelper.HasFormDataContentDisposition(contentDisposition))
                {
                    // This is the form data section, process the DTO
                    var key = HeaderUtilities.RemoveQuotes(contentDisposition.Name).Value;
                    if (key != "dto") continue;

                    using var streamReader = new StreamReader(section.Body);
                    var value = await streamReader.ReadToEndAsync();
                    dto = JsonConvert.DeserializeObject<CreateFileDto>(value); // Deserialize the DTO
                }
            }

            if (dto is null)
                throw new BadRequestException("DTO not found in the request.");

            var validationResults = new List<ValidationResult>();
            if (!Validator.TryValidateObject(dto, new ValidationContext(dto), validationResults))
                throw new BadRequestException(validationResults.First().ErrorMessage!);

            if (fileSection?.FileStream is null)
                throw new BadRequestException("File not found in the request.");

            var bytesRead =
                await blobRepo.UploadBlob(fileSection.FileName, "files", fileSection.FileStream);

            return Ok(new { message = "File uploaded successfully", bytesRead });
        }
    }
}