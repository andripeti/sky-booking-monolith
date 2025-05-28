using Booking;
using BuildingBlocks.CAP;
using BuildingBlocks.Domain;
using BuildingBlocks.Exception;
using BuildingBlocks.Jwt;
using BuildingBlocks.Logging;
using BuildingBlocks.MediatR;
using BuildingBlocks.OpenApi;
using BuildingBlocks.Web;
using Figgle;
using Flight;
using Hellang.Middleware.ProblemDetails;
using Identity;
using Passenger;
using Serilog;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var env = builder.Environment;

var appOptions = builder.Services.GetOptions<AppOptions>("AppOptions");
Console.WriteLine(FiggleFonts.Standard.Render(appOptions.Name));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Access-Control-Allow-Origin");
    });
});

builder.AddCustomSerilog(env);
builder.Services.AddJwt();
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

builder.Services.AddCustomCap();
builder.Services.AddTransient<IBusPublisher, BusPublisher>();
builder.Services.AddCustomVersioning();

builder.Services.AddAspnetOpenApi();

builder.Services.AddCustomProblemDetails();

builder.Services.AddFlightModules(configuration);
builder.Services.AddPassengerModules(configuration);
builder.Services.AddBookingModules(configuration);
builder.Services.AddIdentityModules(configuration, env);

builder.Services.AddEasyCaching(options => { options.UseInMemory(configuration, "mem"); });

builder.Services.AddCustomMediatR(
    typeof(FlightRoot).Assembly,
    typeof(IdentityRoot).Assembly,
    typeof(PassengerModule).Assembly,
    typeof(BookingRoot).Assembly
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseAspnetOpenApi();
}

// Add middleware to handle preflight requests
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        context.Response.StatusCode = 200;
        return;
    }
    await next();
});

app.UseSerilogRequestLogging();
app.UseCorrelationId();
app.UseRouting();

// Use CORS before auth
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();
// app.UseHttpsRedirection(); // Commented out to allow HTTP requests

app.UseFlightModules();
app.UsePassengerModules();
app.UseBookingModules();
app.UseIdentityModules();

app.UseProblemDetails();

app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

// Add health endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
   .RequireCors("AllowAll");

app.MapGet("/", x => x.Response.WriteAsync(appOptions.Name));

app.Run();
