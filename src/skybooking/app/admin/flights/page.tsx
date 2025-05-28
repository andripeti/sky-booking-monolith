"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plane, Plus, Edit } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

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

export default function AdminFlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const fetchFlights = async () => {
    setLoading(true)

    try {
      const response = await apiClient.getAvailableFlights()
      setFlights(response.data || [])
    } catch (error) {
      console.error("Error fetching flights:", error)
      setFlights([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlights()
  }, [])

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
            <h1 className="text-2xl font-bold text-gray-900">SkyBooking Admin</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Flight Management</h2>
          <div className="flex space-x-4">
            <Link href="/admin">
              <Button variant="outline">Back to Admin</Button>
            </Link>
            <Link href="/admin/flights/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Flight
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Flights</CardTitle>
            <CardDescription>Manage your flight inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading flights...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flight Number</TableHead>
                    <TableHead>Aircraft ID</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Arrival</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flights.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No flights found
                      </TableCell>
                    </TableRow>
                  ) : (
                    flights.map((flight) => (
                      <TableRow key={flight.id}>
                        <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                        <TableCell>{flight.aircraftId}</TableCell>
                        <TableCell>
                          <div>
                            <div>Airport {flight.departureAirportId}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(flight.departureDate).toLocaleString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>Airport {flight.arrivalAirportId}</div>
                            <div className="text-sm text-gray-500">{new Date(flight.arrivalDate).toLocaleString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>${flight.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(flight.status)}>{getStatusText(flight.status)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
