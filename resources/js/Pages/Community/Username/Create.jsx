'use client'

import React, { useState, useEffect } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/Components/ui/card"
import { ChevronRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function EditProfile() {
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data, setData, post, processing, errors } = useForm({
    username: '',
  })

  const validateUsername = (username) => {
    if (!username) {
      return 'Username is required'
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters long'
    }
    if (username.length > 20) {
      return 'Username must not exceed 20 characters'
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores'
    }
    return ''
  }

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value
    setData('username', newUsername)
    setError(validateUsername(newUsername))
  }

  const createUsername = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    const validationError = validateUsername(data.username)
    if (validationError) {
      setError(validationError)
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      post(route("create-account.store"), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setIsLoading(false)
          toast.success('Username created successfully!')
        },
        onError: () => {
          setIsLoading(false)
          toast.error('Failed to create username. Please try again.')
        }
      })
    }, 2000) // 2 second delay
  }

  useEffect(() => {
    if (processing) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [processing])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Head title='Create Username' />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Create Username</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createUsername} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                name="username"
                placeholder="Enter your username" 
                value={data.username}
                onChange={handleUsernameChange}
              />
              {((isSubmitted && errors.username) || error) && (
                <p className="text-sm text-destructive">{errors.username || error}</p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!!error || isLoading}
            onClick={createUsername}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

