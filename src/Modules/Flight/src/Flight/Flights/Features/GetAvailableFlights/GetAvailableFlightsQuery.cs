using System;
using System.Collections.Generic;
using BuildingBlocks.Caching;
using Flight.Flights.Dtos;
using MediatR;

namespace Flight.Flights.Features.GetAvailableFlights;

public record GetAvailableFlightsQuery : IRequest<IEnumerable<FlightResponseDto>>, ICacheRequest
{
    public long? DepartureAirportId { get; init; }
    public long? ArrivalAirportId { get; init; }
    public DateTime? DepartureDate { get; init; }
    public DateTime? ArrivalDate { get; init; }
    public string CacheKey => $"GetAvailableFlightsQuery-{DepartureAirportId}-{ArrivalAirportId}-{DepartureDate?.ToString("yyyy-MM-dd")}-{ArrivalDate?.ToString("yyyy-MM-dd")}";
    public DateTime? AbsoluteExpirationRelativeToNow => DateTime.Now.AddHours(1);
}
