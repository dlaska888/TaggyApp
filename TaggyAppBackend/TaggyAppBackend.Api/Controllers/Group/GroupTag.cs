using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sieve.Models;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.Tag;
using TaggyAppBackend.Api.Services.Interfaces;

namespace TaggyAppBackend.Api.Controllers.Group;

[ApiController]
[Route("group/{groupId}/tag")]
[Authorize]
public class GroupTag(ITagService tagService) : ControllerBase
{
    [HttpGet("{tagId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetTagDto>> GetById(string groupId, string tagId)
    {
        var tag = await tagService.GetById(groupId, tagId);
        return Ok(tag);
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PagedResults<GetTagDto>>> GetAll(string groupId, [FromQuery] SieveModel query)
    {
        var tags = await tagService.GetAllByGroupId(groupId, query);
        return Ok(tags);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<GetTagDto>> Create(string groupId, CreateTagDto dto)
    {
        var createdTag = await tagService.Create(groupId, dto);
        return CreatedAtAction(nameof(GetById), new { groupId, tagId = createdTag.Id },
            createdTag);
    }

    [HttpPut("{tagId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetTagDto>> Update(string groupId, string tagId, UpdateTagDto dto)
    {
        var updatedTag = await tagService.Update(groupId, tagId, dto);
        return Ok(updatedTag);
    }

    [HttpDelete("{tagId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string groupId, string tagId)
    {
        await tagService.Delete(groupId, tagId);
        return NoContent();
    }
}