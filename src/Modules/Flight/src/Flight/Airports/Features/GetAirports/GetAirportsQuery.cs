using System.Collections.Generic;
using Flight.Airports.Dtos;
using MediatR;

namespace Flight.Airports.Features.GetAirports;

public record GetAirportsQuery() : IRequest<IEnumerable<AirportResponseDto>>; 