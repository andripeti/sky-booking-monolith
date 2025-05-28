using System.Threading;
using System.Threading.Tasks;
using Flight.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Flight.Flights.Features.ClearFlights;

public class ClearFlightsCommandHandler : IRequestHandler<ClearFlightsCommand, int>
{
    private readonly FlightDbContext _flightDbContext;
    private readonly ILogger<ClearFlightsCommandHandler> _logger;

    public ClearFlightsCommandHandler(
        FlightDbContext flightDbContext,
        ILogger<ClearFlightsCommandHandler> logger)
    {
        _flightDbContext = flightDbContext;
        _logger = logger;
    }

    public async Task<int> Handle(ClearFlightsCommand request, CancellationToken cancellationToken)
    {
        // First clear any related seats
        await _flightDbContext.Seats
            .Where(s => !s.IsDeleted)
            .ExecuteUpdateAsync(s => 
                s.SetProperty(x => x.IsDeleted, true), 
                cancellationToken);

        // Then soft delete all flights
        var deletedCount = await _flightDbContext.Flights
            .Where(f => !f.IsDeleted)
            .ExecuteUpdateAsync(f => 
                f.SetProperty(x => x.IsDeleted, true), 
                cancellationToken);

        _logger.LogInformation("Cleared {Count} flights and their associated seats", deletedCount);

        return deletedCount;
    }
} 