using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sieve.Models;
using TaggyAppBackend.Api.Models.Dtos;
using TaggyAppBackend.Api.Models.Dtos.GroupUser;
using TaggyAppBackend.Api.Services.Interfaces;

namespace TaggyAppBackend.Api.Controllers.Group;

[ApiController]
[Route("group/{groupId}/group-user")]
[Authorize]
public class GroupUser(IGroupUserService groupUserService) : ControllerBase
{
    [HttpGet("{userId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetGroupUserDto>> GetById(string groupId, string userId)
    {
        var groupUser = await groupUserService.GetById(groupId, userId);
        return Ok(groupUser);
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PagedResults<GetGroupUserDto>>> GetAll(string groupId, [FromQuery] SieveModel query)
    {
        var groupUsers = await groupUserService.GetAll(groupId, query);
        return Ok(groupUsers);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<GetGroupUserDto>> Create(string groupId, CreateGroupUserDto dto)
    {
        var createdGroupUser = await groupUserService.Create(groupId, dto);
        return CreatedAtAction(nameof(GetById), new { groupId, userId = createdGroupUser.UserId }, createdGroupUser);
    }

    [HttpPut("{userId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetGroupUserDto>> Update(string groupId, string userId, UpdateGroupUserDto dto)
    {
        var updatedGroupUser = await groupUserService.Update(groupId, userId, dto);
        return Ok(updatedGroupUser);
    }

    [HttpDelete("{userId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string groupId, string userId)
    {
        await groupUserService.Delete(groupId, userId);
        return NoContent();
    }
}
