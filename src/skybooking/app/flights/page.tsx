"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plane, Clock, MapPin, DollarSign } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

interface Flight {
  id: number
  flightNumber: string
  aircraftId: number
  departureAirportId: number
  arrivalAirportId: number
  departureDate: string
  arriveDate: string // Note: backend uses 'arriveDate' not 'arrivalDate'
  durationMinutes: number
  flightDate: string
  price: number
  status: number
  // Additional fields that might come from API
  departureAirport?: string
  arrivalAirport?: string
}

function FlightsContent() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
  })

  const [airports, setAirports] = useState<{ [key: number]: string }>({})

  const fetchAirportName = async (airportId: number): Promise<string> => {
    // Check if we already have this airport cached
    if (airports[airportId]) {
      return airports[airportId]
    }

    try {
      const response = await apiClient.getAirportById(airportId)
      if (response.data) {
        const airportName = `${response.data.code} - ${response.data.name}`
        setAirports((prev) => ({ ...prev, [airportId]: airportName }))
        return airportName
      }
    } catch (error) {
      console.warn(`Could not fetch airport ${airportId}:`, error)
    }

    return `Airport ${airportId}`
  }

  const fetchFlights = async (useSearchParams = false) => {
    setLoading(true)

    try {
      let apiSearchParams = undefined

      if (useSearchParams && (searchParams.from || searchParams.to || searchParams.date)) {
        apiSearchParams = {}

        // Convert airport names/codes to IDs if needed
        // For now, we'll just use the date parameter
        if (searchParams.date) {
          const searchDate = new Date(searchParams.date)
          if (!isNaN(searchDate.getTime())) {
            apiSearchParams.departureDate = searchDate.toISOString()
          }
        }
      }

      const response = await apiClient.getAvailableFlights(apiSearchParams)

      if (response.data && Array.isArray(response.data)) {
        console.log("✅ Raw flight data from API:", response.data)
        setFlights(response.data)
      } else {
        console.warn("⚠️ No flights data received from API, using mock data")
        setFlights(getMockFlights())
      }
    } catch (error) {
      console.error("❌ Error fetching flights:", error)
      setFlights(getMockFlights())
    } finally {
      setLoading(false)
    }
  }

  const getMockFlights = (): Flight[] => [
    {
      id: 1,
      flightNumber: "SK101",
      aircraftId: 1,
      departureAirportId: 1,
      arrivalAirportId: 2,
      departureDate: "2024-02-15T08:00:00",
      arriveDate: "2024-02-15T11:30:00",
      durationMinutes: 330,
      flightDate: "2024-02-15T00:00:00",
      price: 299.99,
      status: 0,
      departureAirport: "JFK - New York",
      arrivalAirport: "LAX - Los Angeles",
    },
    {
      id: 2,
      flightNumber: "SK202",
      aircraftId: 2,
      departureAirportId: 2,
      arrivalAirportId: 3,
      departureDate: "2024-02-15T14:00:00",
      arriveDate: "2024-02-15T19:45:00",
      durationMinutes: 285,
      flightDate: "2024-02-15T00:00:00",
      price: 189.99,
      status: 0,
      departureAirport: "LAX - Los Angeles",
      arrivalAirport: "ORD - Chicago",
    },
    {
      id: 3,
      flightNumber: "SK303",
      aircraftId: 1,
      departureAirportId: 3,
      arrivalAirportId: 4,
      departureDate: "2024-02-16T09:15:00",
      arriveDate: "2024-02-16T12:30:00",
      durationMinutes: 195,
      flightDate: "2024-02-16T00:00:00",
      price: 159.99,
      status: 0,
      departureAirport: "ORD - Chicago",
      arrivalAirport: "MIA - Miami",
    },
  ]

  useEffect(() => {
    fetchFlights()
  }, [])

  const calculateDuration = (departureDate: string, arriveDate: string, durationMinutes?: number): number => {
    // First try to use the durationMinutes if available
    if (durationMinutes && !isNaN(durationMinutes)) {
      return durationMinutes
    }

    // Otherwise calculate from departure and arrival dates
    try {
      const departure = new Date(departureDate)
      const arrival = new Date(arriveDate)

      if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
        console.warn("⚠️ Invalid date format for flight duration calculation")
        return 0
      }

      const diffMs = arrival.getTime() - departure.getTime()
      const diffMinutes = Math.floor(diffMs / (1000 * 60))

      return diffMinutes > 0 ? diffMinutes : 0
    } catch (error) {
      console.error("❌ Error calculating flight duration:", error)
      return 0
    }
  }

  const formatDuration = (minutes: number) => {
    if (!minutes || isNaN(minutes) || minutes <= 0) {
      return "Duration TBD"
    }

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Date TBD"
      }
      return date.toLocaleString()
    } catch (error) {
      console.error("❌ Error formatting date:", error)
      return "Date TBD"
    }
  }

  const getAirportDisplay = (flight: Flight, type: "departure" | "arrival") => {
    if (type === "departure") {
      // If we have the actual airport name from the flight data, use it
      if (flight.departureAirport) {
        return flight.departureAirport
      }
      // Check if we have it cached
      if (airports[flight.departureAirportId]) {
        return airports[flight.departureAirportId]
      }
      // Fetch it asynchronously and return placeholder for now
      fetchAirportName(flight.departureAirportId)
      return "Loading..."
    } else {
      // If we have the actual airport name from the flight data, use it
      if (flight.arrivalAirport) {
        return flight.arrivalAirport
      }
      // Check if we have it cached
      if (airports[flight.arrivalAirportId]) {
        return airports[flight.arrivalAirportId]
      }
      // Fetch it asynchronously and return placeholder for now
      fetchAirportName(flight.arrivalAirportId)
      return "Loading..."
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Scheduled"
      case 1:
        return "Flying"
      case 2:
        return "Delayed"
      case 3:
        return "Cancelled"
      case 4:
        return "Completed"
      default:
        return "Unknown"
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "bg-blue-100 text-blue-800"
      case 1:
        return "bg-green-100 text-green-800"
      case 2:
        return "bg-yellow-100 text-yellow-800"
      case 3:
        return "bg-red-100 text-red-800"
      case 4:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SkyBooking</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Search Flights</h2>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Flight</CardTitle>
            <CardDescription>Search for available flights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  placeholder="Departure city"
                  value={searchParams.from}
                  onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  placeholder="Destination city"
                  value={searchParams.to}
                  onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="date">Departure Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={() => fetchFlights(true)} className="w-full" disabled={loading}>
                  {loading ? "Searching..." : "Search Flights"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flight Results */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Available Flights</h3>

          {loading ? (
            <div className="text-center py-8">Loading flights...</div>
          ) : (
            <div className="space-y-4">
              {flights.map((flight) => {
                const duration = calculateDuration(flight.departureDate, flight.arriveDate, flight.durationMinutes)

                return (
                  <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <Badge variant="secondary">{flight.flightNumber}</Badge>
                            <Badge variant="outline" className={getStatusColor(flight.status)}>
                              {getStatusText(flight.status)}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Departure Information */}
                            <div className="flex items-start space-x-3">
                              <div className="flex flex-col items-center">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                <div className="text-xs text-gray-400 mt-1">FROM</div>
                              </div>
                              <div>
                                <div className="font-semibold text-lg">{getAirportDisplay(flight, "departure")}</div>
                                <div className="text-sm text-gray-500">{formatDate(flight.departureDate)}</div>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">Duration: {formatDuration(duration)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Arrival Information */}
                            <div className="flex items-start space-x-3">
                              <div className="flex flex-col items-center">
                                <MapPin className="h-5 w-5 text-green-600" />
                                <div className="text-xs text-gray-400 mt-1">TO</div>
                              </div>
                              <div>
                                <div className="font-semibold text-lg">{getAirportDisplay(flight, "arrival")}</div>
                                <div className="text-sm text-gray-500">{formatDate(flight.arriveDate)}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-2xl font-bold text-green-600">
                              {flight.price ? flight.price.toFixed(2) : "TBD"}
                            </span>
                          </div>
                          <Link href={`/flights/${flight.id}/seats`}>
                            <Button disabled={flight.status !== 0 && flight.status !== 1}>
                              {flight.status === 0 || flight.status === 1 ? "Select Seats" : "Unavailable"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FlightsPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading flights...</div>}
    >
      <FlightsContent />
    </Suspense>
  )
}
