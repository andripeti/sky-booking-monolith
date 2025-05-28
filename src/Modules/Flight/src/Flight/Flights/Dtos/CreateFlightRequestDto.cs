using System;
using System.ComponentModel.DataAnnotations;
using Flight.Flights.Features.CreateFlight;
using Flight.Flights.Models;

namespace Flight.Flights.Dtos;

public record CreateFlightRequestDto
{
    [Required(ErrorMessage = "Flight number is required")]
    [StringLength(10, ErrorMessage = "Flight number cannot exceed 10 characters")]
    public string FlightNumber { get; init; }

    [Required(ErrorMessage = "Aircraft ID is required")]
    [Range(1, long.MaxValue, ErrorMessage = "Aircraft ID must be greater than 0")]
    public long AircraftId { get; init; }

    [Required(ErrorMessage = "Departure airport ID is required")]
    [Range(1, long.MaxValue, ErrorMessage = "Departure airport ID must be greater than 0")]
    public long DepartureAirportId { get; init; }

    [Required(ErrorMessage = "Arrival airport ID is required")]
    [Range(1, long.MaxValue, ErrorMessage = "Arrival airport ID must be greater than 0")]
    public long ArrivalAirportId { get; init; }

    [Required(ErrorMessage = "Departure date is required")]
    public DateTime DepartureDate { get; init; }

    [Required(ErrorMessage = "Arrival date is required")]
    public DateTime ArrivalDate { get; init; }

    [Required(ErrorMessage = "Price is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; init; }

    [Required(ErrorMessage = "Status is required")]
    [Range(1, 4, ErrorMessage = "Invalid flight status. Must be one of: Flying (1), Delay (2), Canceled (3), Completed (4)")]
    public FlightStatus Status { get; init; }

    [Required(ErrorMessage = "Duration in minutes is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Duration must be greater than 0 minutes")]
    public decimal DurationMinutes { get; init; }

    public CreateFlightCommand ToCommand()
    {
        return new CreateFlightCommand(
            FlightNumber,
            AircraftId,
            DepartureAirportId,
            DepartureDate,
            ArrivalDate,
            ArrivalAirportId,
            DurationMinutes,
            DepartureDate, // FlightDate is same as DepartureDate
            Status,
            Price
        );
    }
} 