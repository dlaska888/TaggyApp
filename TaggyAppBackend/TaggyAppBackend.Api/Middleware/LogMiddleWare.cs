using System.Security.Claims;

namespace TaggyAppBackend.Api.Middleware;

public class LogMiddleWare: IMiddleware
{
    private readonly ILogger<LogMiddleWare> _logger;

    public LogMiddleWare(
        ILogger<LogMiddleWare> logger
        )
    {
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        LogOperation(context);
        await next.Invoke(context);
    }
    
    
    private void LogOperation(HttpContext context)
    {
        _logger.LogInformation(
            "Executing operation: {Operation}\n" +
            "TraceId: {TraceId}\n" +
            "ExecutedBy: ID: {ExecutedByID} | Name: {ExecutedByName} | IP: {ExecutedByIp}",
            context.GetEndpoint()?.DisplayName,
            context.TraceIdentifier,
            context.User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "Anonymous",
            context.User.FindFirst(c => c.Type == ClaimTypes.Name)?.Value ?? "Anonymous",
            context.Connection.RemoteIpAddress
        );
    }
}