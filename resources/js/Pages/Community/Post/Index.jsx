'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Button } from "@/Components/ui/button"
import { Textarea } from "@/Components/ui/textarea"
import { Paperclip, Send } from 'lucide-react'
import { useState } from 'react'
import Navigation from "../Partials/Navigation"
import { Head } from "@inertiajs/react"

export default function Post({ user }) {
    const [postContent, setPostContent] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Submitting post:', postContent)
  
        setPostContent('')
    }
    return (
        <div className="max-w-lg mx-auto bg-background min-h-screen">
          <Head title="New Post" />
            {/* Top Bar */}
            <div className="flex justify-between items-center p-4 border-b">
                <h1 className="text-xl font-bold">Klinik Gunung</h1>
            </div>

            <div className="p-4">
                {/* Post Form */}
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="x" alt="Profile" />
                                <AvatarFallback>P</AvatarFallback>
                            </Avatar>
                            <div className="w-0.5 grow mt-2 bg-gray-200" />
                        </div>
                        <div className="flex-1 min-h-[120px]">
                            <div className="font-semibold mb-1">{user.username}</div>
                            <Textarea 
                                placeholder="Start a post..."
                                className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <Button type="button" variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                                    <Paperclip className="h-5 w-5 text-gray-500" />
                                </Button>
                                <Button type="submit" className="rounded-full">
                                    <Send className="h-5 w-5 mr-2" />
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Navigation />
        </div>
    )
}

