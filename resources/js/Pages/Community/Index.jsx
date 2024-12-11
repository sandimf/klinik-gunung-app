'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/Components/ui/card"
import { Heart, MessageCircle, Repeat2, Send, MoreHorizontal } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { ScrollArea } from "@/Components/ui/scroll-area"
import Navigation from "./Partials/Navigation"
import { Head } from "@inertiajs/react"

const posts = [
  {
    id: 1,
    username: "Ruchi_shah",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Failures are stepping stones to success. Embrace them, learn from them, and keep moving forward",
    timeAgo: "49m",
    likes: "1 like"
  },
  {
    id: 2,
    username: "Payal_shah",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Yes",
    timeAgo: "44m",
    likes: "1 like"
  },
  {
    id: 3,
    username: "Krunal modi",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Hey @zuck where is my verified?",
    timeAgo: "50m",
    replies: "2 replies"
  },
  {
    id: 4,
    username: "zuck",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Just a sec...😂",
    timeAgo: "50m",
    isVerified: true
  },
  {
    id: 5,
    username: "figma",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Hello new (old) friends ✌️",
    timeAgo: "6m",
    replies: "32k replies",
    isVerified: true
  }
]

export default function SocialFeed() {
  return (
    <div className="max-w-lg mx-auto bg-background min-h-screen">
      <Head title="Community" />
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">Klinik Gunung</h1>
      </div>

      {/* Posts Feed */}
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-4 p-4">
          {posts.map((post) => (
            <ThreadPost
              key={post.id}
              avatar={post.avatar}
              name={post.username}
              time={post.timeAgo}
              content={post.content}
              verified={post.isVerified}
              replies={post.replies}
              likes={post.likes}
            />
          ))}
        </div>
      </ScrollArea>

      <Navigation />
    </div>
  )
}

function ThreadPost({
  avatar,
  name,
  time,
  content,
  verified = false,
  replies,
  likes,
}) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-start space-x-3 p-4 pb-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-semibold">{name}</span>
              {verified && (
                <span className="text-blue-500">✓</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">{time}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-base">{content}</p>
        <div className="flex gap-4 mt-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Repeat2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Send className="h-5 w-5" />
          </Button>
        </div>
        {(likes || replies) && (
          <p className="text-sm text-muted-foreground mt-2">
            {likes && <span>{likes}</span>}
            {likes && replies && " • "}
            {replies && <span>{replies}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  )
}