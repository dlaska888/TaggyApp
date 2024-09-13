using Microsoft.AspNetCore.Mvc;
using TaggyAppBackend.Api.Repos.Interfaces;

namespace TaggyAppBackend.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class Blob(IBlobRepo blobRepo) : ControllerBase
    {
        [HttpPost("upload-block")]
        public async Task<IActionResult> UploadFileInBlocks()
        {
            var result = await blobRepo.UploadFileToBlobAsync(Request.Body, "test.jpg");
            return Ok(result);
        }
    }
}
