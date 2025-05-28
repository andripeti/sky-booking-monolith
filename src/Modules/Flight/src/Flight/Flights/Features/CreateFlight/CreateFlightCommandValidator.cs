using System;
using Flight.Flights.Models;
using FluentValidation;

namespace Flight.Flights.Features.CreateFlight;

public class CreateFlightCommandValidator : AbstractValidator<CreateFlightCommand>
{
    public CreateFlightCommandValidator()
    {
        CascadeMode = CascadeMode.Stop;

        RuleFor(x => x.FlightNumber)
            .NotEmpty().WithMessage("Flight number is required")
            .MaximumLength(10).WithMessage("Flight number cannot exceed 10 characters");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");

        RuleFor(x => x.Status)
            .Must(p => Enum.IsDefined(typeof(FlightStatus), p))
            .WithMessage("Invalid flight status. Must be one of: Scheduled (0), Flying (1), Delay (2), Canceled (3), Completed (4)");

        RuleFor(x => x.AircraftId)
            .NotEmpty().WithMessage("Aircraft ID is required")
            .GreaterThan(0).WithMessage("Invalid Aircraft ID");

        RuleFor(x => x.DepartureAirportId)
            .NotEmpty().WithMessage("Departure Airport ID is required")
            .GreaterThan(0).WithMessage("Invalid Departure Airport ID");

        RuleFor(x => x.ArriveAirportId)
            .NotEmpty().WithMessage("Arrival Airport ID is required")
            .GreaterThan(0).WithMessage("Invalid Arrival Airport ID")
            .NotEqual(x => x.DepartureAirportId).WithMessage("Arrival airport must be different from departure airport");

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).WithMessage("Duration must be greater than 0 minutes");

        RuleFor(x => x.DepartureDate)
            .NotEmpty().WithMessage("Departure date is required")
            .GreaterThan(DateTime.UtcNow).WithMessage("Departure date must be in the future");

        RuleFor(x => x.ArriveDate)
            .NotEmpty().WithMessage("Arrival date is required")
            .GreaterThan(x => x.DepartureDate).WithMessage("Arrival date must be after departure date");

        RuleFor(x => x.FlightDate)
            .NotEmpty().WithMessage("Flight date is required")
            .Equal(x => x.DepartureDate).WithMessage("Flight date must match departure date");
    }
}
