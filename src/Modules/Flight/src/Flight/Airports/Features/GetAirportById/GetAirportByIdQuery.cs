using Flight.Airports.Dtos;
using MediatR;

namespace Flight.Airports.Features.GetAirportById;

public record GetAirportByIdQuery(long Id) : IRequest<AirportResponseDto>; 