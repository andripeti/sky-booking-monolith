using MediatR;
using Passenger.Passengers.Dtos;

namespace Passenger.Passengers.Features.GetPassengerById
{
    public record GetAllPassengersQuery : IRequest<List<PassengerResponseDto>>;
}
