using MapsterMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Passenger.Data;
using Passenger.Passengers.Dtos;
using Passenger.Passengers.Features.GetPassengerById;

namespace Passenger.Passengers.Features.GetAllPassengers;

public class GetAllPassengersQueryHandler : IRequestHandler<GetAllPassengersQuery, List<PassengerResponseDto>>
{
    private readonly PassengerDbContext _passengerDbContext;
    private readonly IMapper _mapper;

    public GetAllPassengersQueryHandler(IMapper mapper, PassengerDbContext passengerDbContext)
    {
        _mapper = mapper;
        _passengerDbContext = passengerDbContext;
    }

    public async Task<List<PassengerResponseDto>> Handle(GetAllPassengersQuery request, CancellationToken cancellationToken)
    {
        var passengers = await _passengerDbContext.Passengers.ToListAsync(cancellationToken);
        return _mapper.Map<List<PassengerResponseDto>>(passengers);
    }
}
