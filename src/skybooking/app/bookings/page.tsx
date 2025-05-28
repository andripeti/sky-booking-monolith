"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plane, Calendar, MapPin, Plus } from "lucide-react"
import Link from "next/link"

interface Booking {
  id: number
  flightNumber: string
  passengerName: string
  departureAirport: string
  arrivalAirport: string
  departureDate: string
  seatNumber: string
  status: string
  description: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [newBooking, setNewBooking] = useState({
    passengerId: "",
    flightId: "",
    description: "",
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      // Mock booking data
      const mockBookings: Booking[] = [
        {
          id: 1,
          flightNumber: "SK101",
          passengerName: "John Doe",
          departureAirport: "JFK - New York",
          arrivalAirport: "LAX - Los Angeles",
          departureDate: "2024-02-15T08:00:00",
          seatNumber: "12A",
          status: "Confirmed",
          description: "Business trip to Los Angeles",
        },
        {
          id: 2,
          flightNumber: "SK202",
          passengerName: "John Doe",
          departureAirport: "LAX - Los Angeles",
          arrivalAirport: "ORD - Chicago",
          departureDate: "2024-02-20T14:00:00",
          seatNumber: "8C",
          status: "Pending",
          description: "Return flight via Chicago",
        },
      ]
      setBookings(mockBookings)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log("Creating booking:", newBooking)
      // Here you would call the create booking API
      alert("Booking created successfully!")
      setNewBooking({ passengerId: "", flightId: "", description: "" })
      fetchBookings()
    } catch (error) {
      console.error("Error creating booking:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">My Bookings</h2>

          {/* Create Booking Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
                <DialogDescription>Create a new flight booking</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div>
                  <Label htmlFor="passengerId">Passenger ID</Label>
                  <Input
                    id="passengerId"
                    type="number"
                    value={newBooking.passengerId}
                    onChange={(e) => setNewBooking({ ...newBooking, passengerId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="flightId">Flight ID</Label>
                  <Input
                    id="flightId"
                    type="number"
                    value={newBooking.flightId}
                    onChange={(e) => setNewBooking({ ...newBooking, flightId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBooking.description}
                    onChange={(e) => setNewBooking({ ...newBooking, description: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Booking
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading bookings...</div>
        ) : (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500 mb-4">No bookings found</p>
                  <Link href="/flights">
                    <Button>Browse Flights</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold">Flight {booking.flightNumber}</h3>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </div>
                        <p className="text-gray-600">Passenger: {booking.passengerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Seat {booking.seatNumber}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{booking.departureAirport}</p>
                          <p className="text-sm text-gray-500">Departure</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{booking.arrivalAirport}</p>
                          <p className="text-sm text-gray-500">Arrival</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">{formatDate(booking.departureDate)}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm">
                        <strong>Description:</strong> {booking.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
