using System.Collections.Generic;
using Flight.Aircrafts.Dtos;
using MediatR;

namespace Flight.Aircrafts.Features.GetAircraft;

public record GetAircraftQuery() : IRequest<IEnumerable<AircraftResponseDto>>; 