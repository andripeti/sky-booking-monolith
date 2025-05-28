import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plane } from "lucide-react"
import Link from "next/link"

export default function FlightsLoading() {
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

        {/* Search Form Skeleton */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Flight</CardTitle>
            <CardDescription>Search for available flights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex items-end">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flight Results Skeleton */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Available Flights</h3>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Departure Information Skeleton */}
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col items-center">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-3 w-8 mt-1" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>

                        {/* Arrival Information Skeleton */}
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col items-center">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-3 w-6 mt-1" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-28" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
