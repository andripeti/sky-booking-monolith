"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, User, Mail, Lock, CreditCard, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    passportNumber: "",
    passengerType: "",
    age: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    if (step < 2) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiClient.registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        passportNumber: formData.passportNumber,
      })

      if (response.error) {
        alert(`Registration error: ${response.error}`)
      } else {
        setSuccess(true)
        // Optionally complete passenger registration
        if (formData.passengerType && formData.age) {
          await apiClient.completePassengerRegistration({
            passportNumber: formData.passportNumber,
            passengerType: Number.parseInt(formData.passengerType),
            age: Number.parseInt(formData.age),
          })
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SkyBooking</h1>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-2xl">Registration Successful!</CardTitle>
                <CardDescription>
                  Your account has been created successfully. You can now start booking flights.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/flights">
                  <Button className="w-full">Browse Flights</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Step {step} of 2 - {step === 1 ? "Account Information" : "Passenger Details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="username"
                          className="pl-10"
                          value={formData.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          className="pl-10"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          className="pl-10"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="passportNumber">Passport Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="passportNumber"
                          className="pl-10"
                          value={formData.passportNumber}
                          onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button type="button" onClick={handleNextStep} className="w-full">
                      Next Step
                    </Button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <Label htmlFor="passengerType">Passenger Type</Label>
                      <Select onValueChange={(value) => handleInputChange("passengerType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select passenger type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Adult</SelectItem>
                          <SelectItem value="1">Child</SelectItem>
                          <SelectItem value="2">Infant</SelectItem>
                          <SelectItem value="3">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="age">Age</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="age"
                          type="number"
                          className="pl-10"
                          value={formData.age}
                          onChange={(e) => handleInputChange("age", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button type="button" variant="outline" onClick={handlePrevStep} className="flex-1">
                        Previous
                      </Button>
                      <Button type="submit" className="flex-1" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </>
                )}
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
