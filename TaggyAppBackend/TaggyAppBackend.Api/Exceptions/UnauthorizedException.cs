namespace TaggyAppBackend.Api.Exceptions;

public class UnauthorizedException(string message) : Exception(message);