"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import Link from "next/link"
import { checkInvitedEmail, registerUser } from "@/lib/admin/actions/auth"

export default function RegisterForm() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [fname, setFname] = useState("")
  const [sname, setSname] = useState("")
  const [dob, setDob] = useState("")
  const [position, setPosition] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = await checkInvitedEmail(email)
    if (result.success) {
      setStep(2)
    } else {
      setError("Sorry, you are not invited to be part of the management team.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const result = await registerUser({
        email,
        username,
        password,
        fname,
        sname,
        dob,
        position,
      })
      if (result.success) {
        router.push("/authentication/login")
      } else {
        setError(result.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("An error occurred during registration. Please try again.")
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new admin account</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 text-sm mt-2 mb-4">{error}</p>}
        {step === 1 ? (
          <form onSubmit={handleEmailCheck}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full mt-4" type="submit">
              Next
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="fname"
                  placeholder="First Name"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="sname"
                  placeholder="Surname"
                  value={sname}
                  onChange={(e) => setSname(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="dob"
                  placeholder="Date of Birth"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="position"
                  placeholder="Position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full mt-4" type="submit">
              Register
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href="/authentication/login"
          className="text-sm text-blue-600 hover:underline"
        >
          Already have an account? Login
        </Link>
      </CardFooter>
    </Card>
  )
}
