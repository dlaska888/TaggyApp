namespace TaggyAppBackend.Api.Exceptions;

public class ForbiddenException(string message) : Exception(message);
