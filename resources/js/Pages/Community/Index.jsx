'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/Components/ui/card"
import { Heart, MessageCircle, Repeat2, Send, MoreHorizontal } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { ScrollArea } from "@/Components/ui/scroll-area"
import Navigation from "./Partials/Navigation"
import { Head } from "@inertiajs/react"
import React from 'react'

const CommunityCard = ({ post }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg mb-4">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <img className="h-10 w-10 rounded-full object-cover" src={post.community.user.profile_photo_url || `https://ui-avatars.com/api/?name=${post.community.user.name}&color=7F9CF5&background=EBF4FF`} alt={post.community.user.name} />
                    <div className="ml-4">
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{post.community.user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">@{post.community.username}</div>
                    </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {post.content}
                </p>
                {post.image && (
                    <div className="mb-4">
                        <img src={`/storage/${post.image}`} alt="Post image" className="rounded-lg w-full object-cover" />
                    </div>
                )}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Posted on {new Date(post.created_at).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default function Index({ auth, posts }) {
  const hasCommunityAccount = auth.user.community_account;

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
          {posts.data.map((post) => (
            <CommunityCard key={post.id} post={post} />
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