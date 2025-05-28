"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane, Check } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { apiClient } from "@/lib/api"

interface Seat {
  id: number
  seatNumber: string
  type: string
  class: string
  isAvailable: boolean
  price: number
}

export default function SeatSelectionPage() {
  const params = useParams()
  const flightId = params.id as string
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [reserving, setReserving] = useState(false)

  useEffect(() => {
    fetchSeats()
  }, [flightId])

  const fetchSeats = async () => {
    setLoading(true)

    try {
      const response = await apiClient.getAvailableSeats(Number.parseInt(flightId))
      setSeats(response.data || getMockSeats())
    } catch (error) {
      console.error("Error fetching seats:", error)
      setSeats(getMockSeats())
    } finally {
      setLoading(false)
    }
  }

  const getMockSeats = (): Seat[] => [
    // First Class (Rows 1-3)
    ...Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      seatNumber: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
      type: "Window",
      class: "First",
      isAvailable: Math.random() > 0.3,
      price: 150,
    })),
    // Business Class (Rows 4-8)
    ...Array.from({ length: 30 }, (_, i) => ({
      id: i + 13,
      seatNumber: `${Math.floor(i / 6) + 4}${String.fromCharCode(65 + (i % 6))}`,
      type: i % 6 === 0 || i % 6 === 5 ? "Window" : "Aisle",
      class: "Business",
      isAvailable: Math.random() > 0.4,
      price: 75,
    })),
    // Economy Class (Rows 9-30)
    ...Array.from({ length: 132 }, (_, i) => ({
      id: i + 43,
      seatNumber: `${Math.floor(i / 6) + 9}${String.fromCharCode(65 + (i % 6))}`,
      type: i % 6 === 0 || i % 6 === 5 ? "Window" : i % 6 === 2 || i % 6 === 3 ? "Middle" : "Aisle",
      class: "Economy",
      isAvailable: Math.random() > 0.5,
      price: 25,
    })),
  ]

  const handleSeatSelect = (seatNumber: string) => {
    setSelectedSeat(seatNumber)
  }

  const handleReserveSeat = async () => {
    if (!selectedSeat) return

    setReserving(true)

    try {
      const response = await apiClient.reserveSeat({
        flightId: Number.parseInt(flightId),
        seatNumber: selectedSeat,
      })

      if (response.error) {
        alert(`Error reserving seat: ${response.error}`)
      } else {
        alert(`Seat ${selectedSeat} reserved successfully!`)
        fetchSeats()
        setSelectedSeat(null)
      }
    } catch (error) {
      console.error("Error reserving seat:", error)
      alert("Error reserving seat")
    } finally {
      setReserving(false)
    }
  }

  const getSeatColor = (seat: Seat) => {
    if (!seat.isAvailable) return "bg-red-200 cursor-not-allowed"
    if (selectedSeat === seat.seatNumber) return "bg-blue-500 text-white"
    if (seat.class === "First") return "bg-purple-100 hover:bg-purple-200"
    if (seat.class === "Business") return "bg-blue-100 hover:bg-blue-200"
    return "bg-gray-100 hover:bg-gray-200"
  }

  const groupSeatsByClass = (seats: Seat[]) => {
    return seats.reduce(
      (acc, seat) => {
        if (!acc[seat.class]) acc[seat.class] = []
        acc[seat.class].push(seat)
        return acc
      },
      {} as Record<string, Seat[]>,
    )
  }

  const groupedSeats = groupSeatsByClass(seats)
  const selectedSeatInfo = seats.find((seat) => seat.seatNumber === selectedSeat)

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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Select Your Seat</h2>
          <Link href="/flights">
            <Button variant="outline">Back to Flights</Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="h-5 w-5 mr-2" />
                  Flight {flightId} - Seat Map
                </CardTitle>
                <CardDescription>Click on an available seat to select it</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading seats...</div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedSeats).map(([className, classSeats]) => (
                      <div key={className}>
                        <h4 className="font-semibold mb-3 flex items-center">
                          {className} Class
                          <Badge variant="outline" className="ml-2">
                            +${classSeats[0]?.price || 0}
                          </Badge>
                        </h4>
                        <div className="grid grid-cols-6 gap-2 max-w-md">
                          {classSeats.map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => seat.isAvailable && handleSeatSelect(seat.seatNumber)}
                              className={`
                                p-2 text-xs font-medium rounded transition-colors
                                ${getSeatColor(seat)}
                              `}
                              disabled={!seat.isAvailable}
                            >
                              {seat.seatNumber}
                              {selectedSeat === seat.seatNumber && <Check className="h-3 w-3 mx-auto mt-1" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Seat Selection Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Seat Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedSeat ? (
                  <>
                    <div>
                      <h4 className="font-semibold">Selected Seat</h4>
                      <p className="text-2xl font-bold text-blue-600">{selectedSeat}</p>
                    </div>

                    {selectedSeatInfo && (
                      <>
                        <div>
                          <h4 className="font-semibold">Class</h4>
                          <p>{selectedSeatInfo.class}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold">Type</h4>
                          <p>{selectedSeatInfo.type}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold">Additional Fee</h4>
                          <p className="text-lg font-bold text-green-600">${selectedSeatInfo.price}</p>
                        </div>
                      </>
                    )}

                    <Button onClick={handleReserveSeat} className="w-full" disabled={reserving}>
                      {reserving ? "Reserving..." : "Reserve Seat"}
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-500">Please select a seat to continue</p>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-200 rounded"></div>
                  <span className="text-sm">Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Selected</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
