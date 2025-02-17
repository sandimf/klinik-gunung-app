import React, { useState, useRef } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar"
import { Camera } from 'lucide-react'
import Navigation from '../../Partials/Navigation'

export default function EditProfile({ user }) {
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)

  const { data, setData, post, processing, errors } = useForm({
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    avatar: null,
  })

  const validateForm = () => {
    const newErrors = {}
    if (!data.name.trim()) newErrors.name = 'Name is required'
    if (!data.username.trim()) newErrors.username = 'Username is required'
    if (data.username.length < 3) newErrors.username = 'Username must be at least 3 characters long'
    if (data.username.length > 20) newErrors.username = 'Username must not exceed 20 characters'
    if (!/^[a-zA-Z0-9_]+$/.test(data.username)) newErrors.username = 'Username can only contain letters, numbers, and underscores'
    if (data.bio.length > 160) newErrors.bio = 'Bio must not exceed 160 characters'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length === 0) {
      post(route('profile.update'))
    } else {
      for (const [key, value] of Object.entries(validationErrors)) {
        errors[key] = value
      }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setData('avatar', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Head title="Edit Profile" />
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <AvatarImage src={previewImage || user.avatar} alt="Profile picture" />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            {errors.avatar && <p className="text-sm text-red-500 mt-1">{errors.avatar}</p>}
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={data.username}
              onChange={e => setData('username', e.target.value)}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>

          {/* Bio Input */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={data.bio}
              onChange={e => setData('bio', e.target.value)}
              rows={3}
            />
            {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
            <p className="text-sm text-gray-500">{data.bio.length}/160 characters</p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={processing}
          >
            {processing ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
      <Navigation/>
    </div>
  )
}

