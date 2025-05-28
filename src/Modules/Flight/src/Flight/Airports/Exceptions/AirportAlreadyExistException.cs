using System.Net;
using BuildingBlocks.Exception;

namespace Flight.Airports.Exceptions;

public class AirportAlreadyExistException : AppException
{
    public AirportAlreadyExistException() : base("Airport already exists!", HttpStatusCode.Conflict)
    {
    }
}
