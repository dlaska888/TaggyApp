using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sieve.Models;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.File;
using TaggyAppBackend.Api.Services.Interfaces;

namespace TaggyAppBackend.Api.Controllers.Group;

[ApiController]
[Route("group/{groupId}/file")]
[Authorize]
public class GroupFile(IFileService fileService) : ControllerBase
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
    public async Task<ActionResult<GetFileDto>> Create(string groupId, [FromForm] CreateFileDto dto)
    {
        var createdFile = await fileService.Create(groupId, dto);
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
}