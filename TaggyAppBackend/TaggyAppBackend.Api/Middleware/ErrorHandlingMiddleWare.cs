using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Sieve.Exceptions;
using TaggyAppBackend.Api.Exceptions;

namespace TaggyAppBackend.Api.Middleware;

public class ErrorHandlingMiddleWare(
    ILogger<ErrorHandlingMiddleWare> logger,
    ProblemDetailsFactory problemDetailsFactory)
    : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        ObjectResult? result = null;
        Exception? resultException = null;
        try
        {
            await next.Invoke(context);
        }
        catch (BadRequestException e)
        {
            result = GetValidationResult(context, "Bad request", e.Message);
            resultException = e;
        }
        catch (UnauthorizedException e)
        {
            result = GetResult(context, StatusCodes.Status401Unauthorized, e.Message);
            resultException = e;
        }
        catch (ForbiddenException e)
        {
            result = GetResult(context, StatusCodes.Status403Forbidden, e.Message);
            resultException = e;
        }
        catch (NotFoundException e)
        {
            result = GetResult(context, StatusCodes.Status404NotFound, e.Message);
            resultException = e;
        }
        catch (SieveException e)
        {
            result = GetValidationResult(context, "Sieve error", e.Message);
            resultException = e;
        }
        catch (Exception e)
        {
            result = GetResult(context, StatusCodes.Status500InternalServerError, "Something went wrong");
            resultException = e;
        }
        finally
        {
            if (result is not null)
            {
                LogError(resultException!);
                var actionContext = new ActionContext(context, context.GetRouteData(), new ActionDescriptor());
                await result.ExecuteResultAsync(actionContext);    
            }
        }
    }

    private void LogError(Exception exception)
    {
        logger.LogError(
            "An exception occured.\n" +
            "Type: {ExceptionType}" +
            "Message: {ExceptionMessage}\n" +
            "Stack trace:{ExceptionStackTrace}",
            exception.GetType(),
            exception.Message,
            exception.StackTrace
        );
    }

    private ObjectResult GetResult(HttpContext context, int statusCode, string message)
    {
        var problemDetails = problemDetailsFactory.CreateProblemDetails(context, statusCode, detail: message);
        return new ObjectResult(problemDetails) { StatusCode = statusCode };
    }

    private ObjectResult GetValidationResult(HttpContext context, string title, string message)
    {
        var errors = new ModelStateDictionary();
        errors.AddModelError(title, message);

        var problemDetails = problemDetailsFactory
            .CreateValidationProblemDetails(context, errors, statusCode: StatusCodes.Status400BadRequest);

        return new ObjectResult(problemDetails);
    }
}