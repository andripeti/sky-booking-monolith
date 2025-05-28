"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, Building, Settings, Users, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

interface Airport {
  id: number
  name: string
  code: string
  address: string
}

interface Aircraft {
  id: number
  name: string
  model: string
  manufacturingYear: number
}

interface Flight {
  id: number
  flightNumber: string
  aircraftId: number
  departureAirportId: number
  arrivalAirportId: number
  departureDate: string
  arrivalDate: string
  price: number
  status: number
}

export default function AdminPage() {
  // State for form data
  const [flightData, setFlightData] = useState({
    flightNumber: "",
    aircraftId: "",
    departureAirportId: "",
    arrivalAirportId: "",
    departureDate: "",
    arrivalDate: "",
    flightDate: "",
    durationMinutes: "",
    status: "",
    price: "",
  })

  const [airportData, setAirportData] = useState({
    name: "",
    address: "",
    code: "",
  })

  const [aircraftData, setAircraftData] = useState({
    name: "",
    model: "",
    manufacturingYear: "",
  })

  const [seatData, setSeatData] = useState({
    seatNumber: "",
    type: "",
    class: "",
    flightId: "",
  })

  // State for dropdown data
  const [airports, setAirports] = useState<Airport[]>([])
  const [aircraft, setAircraft] = useState<Aircraft[]>([])
  const [flights, setFlights] = useState<Flight[]>([])

  // Loading states
  const [loadingAirports, setLoadingAirports] = useState(false)
  const [loadingAircraft, setLoadingAircraft] = useState(false)
  const [loadingFlights, setLoadingFlights] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    fetchAirports()
    fetchAircraft()
    fetchFlights()
  }, [])

  const fetchAirports = async () => {
    setLoadingAirports(true)

    try {
      const response = await apiClient.getAllAirports()

      if (response.data && Array.isArray(response.data)) {
        setAirports(response.data)
      } else {
        console.warn("No airports data received from API")
        setAirports([])
      }
    } catch (error) {
      console.error("Error fetching airports:", error)
      setAirports([])
    } finally {
      setLoadingAirports(false)
    }
  }

  const fetchAircraft = async () => {
    setLoadingAircraft(true)

    try {
      const response = await apiClient.getAllAircraft()

      if (response.data && Array.isArray(response.data)) {
        setAircraft(response.data)
      } else {
        console.warn("No aircraft data received from API")
        setAircraft([])
      }
    } catch (error) {
      console.error("Error fetching aircraft:", error)
      setAircraft([])
    } finally {
      setLoadingAircraft(false)
    }
  }

  const fetchFlights = async () => {
    setLoadingFlights(true)

    try {
      const response = await apiClient.getAvailableFlights()

      if (response.data && Array.isArray(response.data)) {
        setFlights(response.data)
      } else {
        console.warn("No flights data received from API")
        setFlights([])
      }
    } catch (error) {
      console.error("Error fetching flights:", error)
      setFlights([])
    } finally {
      setLoadingFlights(false)
    }
  }

  const handleCreateFlight = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await apiClient.createFlight(flightData)

      if (response.error) {
        alert(`Error creating flight: ${response.error}`)
      } else {
        alert("Flight created successfully!")
        setFlightData({
          flightNumber: "",
          aircraftId: "",
          departureAirportId: "",
          arrivalAirportId: "",
          departureDate: "",
          arrivalDate: "",
          flightDate: "",
          durationMinutes: "",
          status: "",
          price: "",
        })
        // Refresh flights list
        fetchFlights()
      }
    } catch (error) {
      console.error("Error creating flight:", error)
      alert("Error creating flight")
    }
  }

  const handleCreateAirport = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await apiClient.createAirport(airportData)

      if (response.error) {
        alert(`Error creating airport: ${response.error}`)
      } else {
        alert("Airport created successfully!")
        setAirportData({ name: "", address: "", code: "" })
        // Refresh airports list
        fetchAirports()
      }
    } catch (error) {
      console.error("Error creating airport:", error)
      alert("Error creating airport")
    }
  }

  const handleCreateAircraft = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await apiClient.createAircraft(aircraftData)

      if (response.error) {
        alert(`Error creating aircraft: ${response.error}`)
      } else {
        alert("Aircraft created successfully!")
        setAircraftData({ name: "", model: "", manufacturingYear: "" })
        // Refresh aircraft list
        fetchAircraft()
      }
    } catch (error) {
      console.error("Error creating aircraft:", error)
      alert("Error creating aircraft")
    }
  }

  const handleCreateSeat = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await apiClient.createSeat(seatData)

      if (response.error) {
        alert(`Error creating seat: ${response.error}`)
      } else {
        alert("Seat created successfully!")
        setSeatData({ seatNumber: "", type: "", class: "", flightId: "" })
      }
    } catch (error) {
      console.error("Error creating seat:", error)
      alert("Error creating seat")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SkyBooking Admin</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

        <Tabs defaultValue="flights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flights" className="flex items-center space-x-2">
              <Plane className="h-4 w-4" />
              <span>Flights</span>
            </TabsTrigger>
            <TabsTrigger value="airports" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Airports</span>
            </TabsTrigger>
            <TabsTrigger value="aircraft" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Aircraft</span>
            </TabsTrigger>
            <TabsTrigger value="seats" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Seats</span>
            </TabsTrigger>
          </TabsList>

          {/* Flights Tab */}
          <TabsContent value="flights">
            <Card>
              <CardHeader>
                <CardTitle>Create New Flight</CardTitle>
                <CardDescription>Add a new flight to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateFlight} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="flightNumber">Flight Number</Label>
                      <Input
                        id="flightNumber"
                        value={flightData.flightNumber}
                        onChange={(e) => setFlightData({ ...flightData, flightNumber: e.target.value })}
                        placeholder="e.g., SK101"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="aircraftId">Aircraft</Label>
                      <Select onValueChange={(value) => setFlightData({ ...flightData, aircraftId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingAircraft ? "Loading aircraft..." : "Select aircraft"} />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingAircraft ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Loading...
                            </SelectItem>
                          ) : (
                            aircraft.map((plane) => (
                              <SelectItem key={plane.id} value={plane.id.toString()}>
                                {plane.name} ({plane.model})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="departureAirportId">Departure Airport</Label>
                      <Select onValueChange={(value) => setFlightData({ ...flightData, departureAirportId: value })}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={loadingAirports ? "Loading airports..." : "Select departure airport"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingAirports ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Loading...
                            </SelectItem>
                          ) : (
                            airports.map((airport) => (
                              <SelectItem key={airport.id} value={airport.id.toString()}>
                                {airport.code} - {airport.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="arrivalAirportId">Arrival Airport</Label>
                      <Select onValueChange={(value) => setFlightData({ ...flightData, arrivalAirportId: value })}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={loadingAirports ? "Loading airports..." : "Select arrival airport"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingAirports ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Loading...
                            </SelectItem>
                          ) : (
                            airports.map((airport) => (
                              <SelectItem key={airport.id} value={airport.id.toString()}>
                                {airport.code} - {airport.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="departureDate">Departure Date</Label>
                      <Input
                        id="departureDate"
                        type="datetime-local"
                        value={flightData.departureDate}
                        onChange={(e) => setFlightData({ ...flightData, departureDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="arrivalDate">Arrival Date</Label>
                      <Input
                        id="arrivalDate"
                        type="datetime-local"
                        value={flightData.arrivalDate}
                        onChange={(e) => setFlightData({ ...flightData, arrivalDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                      <Input
                        id="durationMinutes"
                        type="number"
                        value={flightData.durationMinutes}
                        onChange={(e) => setFlightData({ ...flightData, durationMinutes: e.target.value })}
                        placeholder="e.g., 180"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select onValueChange={(value) => setFlightData({ ...flightData, status: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Scheduled</SelectItem>
                          <SelectItem value="1">Flying</SelectItem>
                          <SelectItem value="2">Delay</SelectItem>
                          <SelectItem value="3">Canceled</SelectItem>
                          <SelectItem value="4">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={flightData.price}
                        onChange={(e) => setFlightData({ ...flightData, price: e.target.value })}
                        placeholder="e.g., 299.99"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Create Flight
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Airports Tab */}
          <TabsContent value="airports">
            <Card>
              <CardHeader>
                <CardTitle>Create New Airport</CardTitle>
                <CardDescription>Add a new airport to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAirport} className="space-y-4">
                  <div>
                    <Label htmlFor="airportName">Airport Name</Label>
                    <Input
                      id="airportName"
                      value={airportData.name}
                      onChange={(e) => setAirportData({ ...airportData, name: e.target.value })}
                      placeholder="e.g., John F. Kennedy International Airport"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="airportAddress">Address</Label>
                    <Input
                      id="airportAddress"
                      value={airportData.address}
                      onChange={(e) => setAirportData({ ...airportData, address: e.target.value })}
                      placeholder="e.g., New York, NY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="airportCode">Airport Code</Label>
                    <Input
                      id="airportCode"
                      value={airportData.code}
                      onChange={(e) => setAirportData({ ...airportData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., JFK, LAX"
                      maxLength={3}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Airport
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aircraft Tab */}
          <TabsContent value="aircraft">
            <Card>
              <CardHeader>
                <CardTitle>Create New Aircraft</CardTitle>
                <CardDescription>Add a new aircraft to the fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAircraft} className="space-y-4">
                  <div>
                    <Label htmlFor="aircraftName">Aircraft Name</Label>
                    <Input
                      id="aircraftName"
                      value={aircraftData.name}
                      onChange={(e) => setAircraftData({ ...aircraftData, name: e.target.value })}
                      placeholder="e.g., Spirit of Innovation"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="aircraftModel">Model</Label>
                    <Input
                      id="aircraftModel"
                      value={aircraftData.model}
                      onChange={(e) => setAircraftData({ ...aircraftData, model: e.target.value })}
                      placeholder="e.g., Boeing 737-800, Airbus A320"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="manufacturingYear">Manufacturing Year</Label>
                    <Input
                      id="manufacturingYear"
                      type="number"
                      value={aircraftData.manufacturingYear}
                      onChange={(e) => setAircraftData({ ...aircraftData, manufacturingYear: e.target.value })}
                      placeholder="e.g., 2020"
                      min="1950"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Aircraft
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seats Tab */}
          <TabsContent value="seats">
            <Card>
              <CardHeader>
                <CardTitle>Create New Seat</CardTitle>
                <CardDescription>Add a new seat to a flight</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSeat} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seatNumber">Seat Number</Label>
                      <Input
                        id="seatNumber"
                        value={seatData.seatNumber}
                        onChange={(e) => setSeatData({ ...seatData, seatNumber: e.target.value.toUpperCase() })}
                        placeholder="e.g., 12A, 5C"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="flightId">Flight</Label>
                      <Select onValueChange={(value) => setSeatData({ ...seatData, flightId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingFlights ? "Loading flights..." : "Select flight"} />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingFlights ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Loading...
                            </SelectItem>
                          ) : (
                            flights.map((flight) => (
                              <SelectItem key={flight.id} value={flight.id.toString()}>
                                {flight.flightNumber} - {new Date(flight.departureDate).toLocaleDateString()}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seatType">Seat Type</Label>
                      <Select onValueChange={(value) => setSeatData({ ...seatData, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select seat type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Window</SelectItem>
                          <SelectItem value="1">Middle</SelectItem>
                          <SelectItem value="2">Aisle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="seatClass">Seat Class</Label>
                      <Select onValueChange={(value) => setSeatData({ ...seatData, class: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select seat class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Economy</SelectItem>
                          <SelectItem value="1">Business</SelectItem>
                          <SelectItem value="2">First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Create Seat
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
