using MediatR;

namespace Flight.Flights.Features.ClearAllData;

public record ClearAllDataCommand() : IRequest<int>; 