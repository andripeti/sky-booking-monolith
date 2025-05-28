const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:5000"

export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

// Enhanced logging utility
class ApiLogger {
  private static isDevelopment = process.env.NODE_ENV === "development"

  static logRequest(method: string, url: string, body?: any) {
    if (!this.isDevelopment) return

    console.group(`🚀 API Request: ${method} ${url}`)
    console.log("Timestamp:", new Date().toISOString())
    console.log("Base URL:", process.env.NEXT_PUBLIC_API_URL || "Not set")
    if (body) {
      console.log("Request Body:", body)
    }
    console.groupEnd()
  }

  static logResponse(method: string, url: string, response: Response, data?: any) {
    if (!this.isDevelopment) return

    const statusColor = response.ok ? "✅" : "❌"
    console.group(`${statusColor} API Response: ${method} ${url}`)
    console.log("Status:", response.status, response.statusText)
    console.log("Headers:", Object.fromEntries(response.headers.entries()))
    console.log("Content-Type:", response.headers.get("content-type"))

    if (data !== undefined) {
      console.log("Response Data:", data)

      // For 400 errors, log validation details if available
      if (response.status === 400 && data) {
        console.group("🔍 Validation Error Details:")
        if (data.errors) {
          console.log("Field Errors:", data.errors)
        }
        if (data.title) {
          console.log("Error Title:", data.title)
        }
        if (data.detail) {
          console.log("Error Detail:", data.detail)
        }
        console.groupEnd()
      }
    }
    console.groupEnd()
  }

  static logError(method: string, url: string, error: any) {
    if (!this.isDevelopment) return

    console.group(`💥 API Error: ${method} ${url}`)
    console.error("Error:", error)
    console.error("Error Type:", typeof error)
    console.error("Error Message:", error?.message)
    console.error("Is Network Error:", error instanceof TypeError && error.message.includes("fetch"))
    console.groupEnd()
  }
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    console.log("🏗️ ApiClient initialized with base URL:", baseUrl)
    console.log("🔧 Environment variable NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL || "Not set")
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const method = options.method || "GET"

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      mode: "cors", // Explicitly set CORS mode
      credentials: "omit", // Don't send credentials for now
      ...options,
    }

    // Log the request
    ApiLogger.logRequest(method, url, options.body ? JSON.parse(options.body as string) : undefined)

    try {
      const response = await fetch(url, config)

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get("content-type")
      const isJson = contentType && contentType.includes("application/json")
      const isHtml = contentType && contentType.includes("text/html")

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        if (isJson) {
          try {
            const errorData = await response.json()
            ApiLogger.logResponse(method, url, response, errorData)
            errorMessage = errorData.message || errorData.title || errorMessage
          } catch (parseError) {
            console.error("Failed to parse error JSON:", parseError)
          }
        } else if (isHtml) {
          const htmlText = await response.text()
          console.log("📄 HTML Error Response (first 500 chars):", htmlText.substring(0, 500))
          errorMessage = `API endpoint not found or server error (${response.status})`
        } else {
          const textResponse = await response.text()
          console.log("📝 Text Error Response:", textResponse)
        }

        return {
          error: errorMessage,
          status: response.status,
        }
      }

      // Handle successful responses
      if (response.status === 204 || response.status === 201) {
        // No content responses
        ApiLogger.logResponse(method, url, response, null)
        return {
          data: null as T,
          status: response.status,
        }
      }

      if (isJson) {
        const data = await response.json()
        ApiLogger.logResponse(method, url, response, data)
        return {
          data,
          status: response.status,
        }
      } else {
        // If successful but not JSON, treat as text
        const text = await response.text()
        ApiLogger.logResponse(method, url, response, text)
        return {
          data: text as T,
          status: response.status,
        }
      }
    } catch (error) {
      ApiLogger.logError(method, url, error)

      // Categorize different types of errors
      if (error instanceof TypeError) {
        if (error.message.includes("fetch")) {
          return {
            error:
              "Network error: Unable to connect to the API server. Please check if the server is running and CORS is configured.",
            status: 0,
          }
        }
        if (error.message.includes("CORS")) {
          return {
            error:
              "CORS error: The API server is not allowing requests from this domain. Please configure CORS on your .NET API.",
            status: 0,
          }
        }
      }

      return {
        error: `Connection failed: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
        status: 0,
      }
    }
  }

  // Flight endpoints
  async getAvailableFlights(searchParams?: {
    departureAirportId?: number
    arrivalAirportId?: number
    departureDate?: string
    arrivalDate?: string
  }) {
    console.log("🛫 Fetching available flights with params:", searchParams)

    let endpoint = "/api/v1/flights/available"

    if (searchParams) {
      const queryParams = new URLSearchParams()

      if (searchParams.departureAirportId) {
        queryParams.append("departureAirportId", searchParams.departureAirportId.toString())
      }

      if (searchParams.arrivalAirportId) {
        queryParams.append("arrivalAirportId", searchParams.arrivalAirportId.toString())
      }

      if (searchParams.departureDate) {
        queryParams.append("departureDate", searchParams.departureDate)
      }

      if (searchParams.arrivalDate) {
        queryParams.append("arrivalDate", searchParams.arrivalDate)
      }

      if (queryParams.toString()) {
        endpoint += `?${queryParams.toString()}`
      }
    }

    return this.request(endpoint)
  }

  async getFlightById(id: number) {
    console.log(`🛫 Fetching flight by ID: ${id}`)
    return this.request(`/api/v1/flight/${id}`)
  }

  async createFlight(flightData: any) {
    console.log("🛫 Creating new flight with raw data:", flightData)

    // Validate required fields before sending
    const requiredFields = [
      "flightNumber",
      "aircraftId",
      "departureAirportId",
      "arrivalAirportId",
      "departureDate",
      "arrivalDate",
      "price",
      "status",
    ]

    const missingFields = requiredFields.filter((field) => !flightData[field] || flightData[field] === "")

    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields)
      return {
        error: `Missing required fields: ${missingFields.join(", ")}`,
        status: 400,
      }
    }

    // Convert string values to proper types with validation
    const processedData: any = {
      flightNumber: flightData.flightNumber?.trim(),
    }

    // Validate and convert aircraftId
    const aircraftId = Number.parseInt(flightData.aircraftId)
    if (isNaN(aircraftId) || aircraftId <= 0) {
      console.error("❌ Invalid aircraftId:", flightData.aircraftId)
      return {
        error: "Aircraft ID must be a valid positive number",
        status: 400,
      }
    }
    processedData.aircraftId = aircraftId

    // Validate and convert departureAirportId
    const departureAirportId = Number.parseInt(flightData.departureAirportId)
    if (isNaN(departureAirportId) || departureAirportId <= 0) {
      console.error("❌ Invalid departureAirportId:", flightData.departureAirportId)
      return {
        error: "Departure Airport ID must be a valid positive number",
        status: 400,
      }
    }
    processedData.departureAirportId = departureAirportId

    // Validate and convert arrivalAirportId
    const arrivalAirportId = Number.parseInt(flightData.arrivalAirportId)
    if (isNaN(arrivalAirportId) || arrivalAirportId <= 0) {
      console.error("❌ Invalid arrivalAirportId:", flightData.arrivalAirportId)
      return {
        error: "Arrival Airport ID must be a valid positive number",
        status: 400,
      }
    }
    processedData.arrivalAirportId = arrivalAirportId

    // Validate and convert price
    const price = Number.parseFloat(flightData.price)
    if (isNaN(price) || price <= 0) {
      console.error("❌ Invalid price:", flightData.price)
      return {
        error: "Price must be a valid positive number",
        status: 400,
      }
    }
    processedData.price = price

    // Validate and convert status
    const status = Number.parseInt(flightData.status)
    if (isNaN(status) || status < 0 || status > 4) {
      console.error("❌ Invalid status:", flightData.status)
      return {
        error: "Status must be a number between 0 and 4",
        status: 400,
      }
    }
    processedData.status = status

    // Validate dates
    const departureDate = new Date(flightData.departureDate)
    const arrivalDate = new Date(flightData.arrivalDate)

    if (isNaN(departureDate.getTime())) {
      console.error("❌ Invalid departure date:", flightData.departureDate)
      return {
        error: "Departure date is invalid",
        status: 400,
      }
    }

    if (isNaN(arrivalDate.getTime())) {
      console.error("❌ Invalid arrival date:", flightData.arrivalDate)
      return {
        error: "Arrival date is invalid",
        status: 400,
      }
    }

    if (arrivalDate <= departureDate) {
      console.error("❌ Arrival date must be after departure date")
      return {
        error: "Arrival date must be after departure date",
        status: 400,
      }
    }

    // Convert dates to ISO string format
    processedData.departureDate = departureDate.toISOString()
    processedData.arrivalDate = arrivalDate.toISOString()

    // Optional duration minutes
    if (flightData.durationMinutes) {
      const duration = Number.parseInt(flightData.durationMinutes)
      if (!isNaN(duration) && duration > 0) {
        processedData.durationMinutes = duration
      }
    }

    console.log("🔄 Final processed flight data:", processedData)
    console.log("📊 Data types:", {
      flightNumber: typeof processedData.flightNumber,
      aircraftId: typeof processedData.aircraftId,
      departureAirportId: typeof processedData.departureAirportId,
      arrivalAirportId: typeof processedData.arrivalAirportId,
      departureDate: typeof processedData.departureDate,
      arrivalDate: typeof processedData.arrivalDate,
      price: typeof processedData.price,
      status: typeof processedData.status,
    })

    return this.request("/api/v1/flight", {
      method: "POST",
      body: JSON.stringify(processedData),
    })
  }

  async updateFlight(flightData: any) {
    console.log("🛫 Updating flight:", flightData)
    return this.request("/api/v1/flight", {
      method: "PUT",
      body: JSON.stringify(flightData),
    })
  }

  // Seat endpoints
  async getAvailableSeats(flightId: number) {
    console.log(`💺 Fetching available seats for flight: ${flightId}`)
    return this.request(`/api/v1/flight/get-available-seats/${flightId}`)
  }

  async createSeat(seatData: any) {
    console.log("💺 Creating new seat:", seatData)
    return this.request("/api/v1/flight/seat", {
      method: "POST",
      body: JSON.stringify(seatData),
    })
  }

  async reserveSeat(reservationData: any) {
    console.log("💺 Reserving seat:", reservationData)
    return this.request("/api/v1/flight/reserve-seat", {
      method: "POST",
      body: JSON.stringify(reservationData),
    })
  }

  // Booking endpoints
  async createBooking(bookingData: any) {
    console.log("📋 Creating new booking:", bookingData)
    return this.request("/api/v1/booking", {
      method: "POST",
      body: JSON.stringify(bookingData),
    })
  }

  // Airport endpoints
  async getAllAirports() {
    console.log("🏢 Fetching all airports...")
    return this.request("/api/v1/airports")
  }

  async getAirportById(id: number) {
    console.log(`🏢 Fetching airport by ID: ${id}`)
    return this.request(`/api/v1/airports/${id}`)
  }

  async createAirport(airportData: any) {
    console.log("🏢 Creating new airport:", airportData)
    // Use the same pattern as flight creation
    return this.request("/api/v1/flight/airport", {
      method: "POST",
      body: JSON.stringify(airportData),
    })
  }

  // Aircraft endpoints
  async getAllAircraft() {
    console.log("✈️ Fetching all aircraft...")
    return this.request("/api/v1/aircraft")
  }

  async createAircraft(aircraftData: any) {
    console.log("✈️ Creating new aircraft:", aircraftData)
    // Use the same pattern as flight creation
    return this.request("/api/v1/flight/aircraft", {
      method: "POST",
      body: JSON.stringify(aircraftData),
    })
  }

  // User endpoints
  async registerUser(userData: any) {
    console.log("👤 Registering new user:", { ...userData, password: "[REDACTED]", confirmPassword: "[REDACTED]" })
    return this.request("/identity/register-user", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async getPassengerById(id: number) {
    console.log(`👤 Fetching passenger by ID: ${id}`)
    return this.request(`/api/v1/passenger/${id}`)
  }

  async completePassengerRegistration(passengerData: any) {
    console.log("👤 Completing passenger registration:", passengerData)
    return this.request("/api/v1/passenger/complete-registration", {
      method: "POST",
      body: JSON.stringify(passengerData),
    })
  }

  // Health check endpoint
  async healthCheck() {
    console.log("🏥 Checking API health...")
    return this.request("/health")
  }
}

export const apiClient = new ApiClient()
