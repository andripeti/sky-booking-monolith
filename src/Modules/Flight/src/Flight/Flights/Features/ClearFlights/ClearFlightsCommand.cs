using MediatR;

namespace Flight.Flights.Features.ClearFlights;

public record ClearFlightsCommand() : IRequest<int>; 