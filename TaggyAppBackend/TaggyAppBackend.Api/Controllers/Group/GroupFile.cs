using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using Sieve.Models;
using TaggyAppBackend.Api.Exceptions;
using TaggyAppBackend.Api.Helpers;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.File;
using TaggyAppBackend.Api.Models.Options;
using TaggyAppBackend.Api.Repos.Interfaces;
using TaggyAppBackend.Api.Services.Interfaces;

namespace TaggyAppBackend.Api.Controllers.Group;

[ApiController]
[Route("group/{groupId}/file")]
[Authorize]
public class GroupFile(IFileService fileService, IBlobRepo blobRepo, IOptions<AzureBlobOptions> blobOptions)
    : ControllerBase
{
    [HttpGet("{fileId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetFileDto>> GetById(string groupId, string fileId)
    {
        var file = await fileService.GetById(groupId, fileId);
        return Ok(file);
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PagedResults<GetFileDto>>> GetAll(string groupId, [FromQuery] SieveModel query)
    {
        var files = await fileService.GetAllByGroupId(groupId, query);
        return Ok(files);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<GetFileDto>> Create(string groupId)
    {
        // Create a MultipartReader to parse the request
        var boundary = MultipartRequestHelper.GetBoundary(
            MediaTypeHeaderValue.Parse(Request.ContentType),
            FormOptions.DefaultMultipartBoundaryLengthLimit);

        var reader = new MultipartReader(boundary, Request.Body, blobOptions.Value.BlockSize);

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

        var createdFile = await fileService.Create(groupId, dto, fileSection.FileStream);
        return CreatedAtAction(nameof(GetById), new { groupId, fileId = createdFile.Id }, createdFile);
    }

    [HttpPut("{fileId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetFileDto>> Update(string groupId, string fileId, [FromBody] UpdateFileDto dto)
    {
        var updatedFile = await fileService.Update(groupId, fileId, dto);
        return Ok(updatedFile);
    }

    [HttpDelete("{fileId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string groupId, string fileId)
    {
        await fileService.Delete(groupId, fileId);
        return NoContent();
    }

    [HttpGet("{fileId}/download")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> Download(string groupId, string fileId)
    {
        var stream = await fileService.Download(groupId, fileId);
        return File(stream, "application/octet-stream");
    }
}