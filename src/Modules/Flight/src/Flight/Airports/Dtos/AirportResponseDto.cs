namespace Flight.Airports.Dtos;

public record AirportResponseDto
{
    public long Id { get; init; }
    public string Name { get; init; }
    public string Code { get; init; }
    public string Address { get; init; }
}
