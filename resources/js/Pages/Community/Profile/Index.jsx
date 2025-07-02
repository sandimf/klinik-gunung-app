"use client";

import {
    MoreHorizontal,
    Heart,
    MessageCircle,
    Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Head } from "@inertiajs/react";
import Navigation from "../Partials/Navigation";
import {Link} from "@inertiajs/react";

export default function ProfilePage({user,isOwner}) {
    return (
        <div className="max-w-lg mx-auto bg-background min-h-screen">
            <Head title={user.username} />
            {/* Top Bar */}
            <div className="flex justify-between items-center p-4 border-b">
                <h1 className="text-xl font-bold">Klinik Gunung</h1>
            </div>
            {/* Profile Section */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            {user.username}
                        </h2>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span>@{user.username}</span>
                        </div>
                    </div>
                    <Avatar className="w-16 h-16">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                </div>

                <p className="mb-4">
                {isOwner 
                    ? (user.bio ? user.bio : "Anda belum memiliki bio.") 
                    : (user.bio ? user.bio : "Akun ini belum memiliki bio.")}
                </p>

                {isOwner && (
                    <div className="flex gap-4 mb-4">
                        <Link href={route('accounts.index')}>
                        <Button className="flex-1" variant="outline">
                            Edit Profile
                        </Button>
                        </Link>
                    </div>
                )}
                <ScrollArea className="h-[400px]">
                    <ThreadPost
                        avatar="/placeholder.svg"
                        name={user.username}
                        time="50m"
                        content="Hey @zuck where is my verified?"
                        replies={2}
                        liked={true}
                    />
                </ScrollArea>
            </div>
            <Navigation/>
        </div>
    );
}

function ThreadPost({
    avatar,
    name,
    time,
    content,
    verified = false,
    replies = 0,
    liked = false,
}) {
    return (
        <div className="p-4 border-b">
            <div className="flex gap-3">
                <Avatar>
                    <AvatarImage src={avatar} />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">{name}</span>
                            {verified && (
                                <span className="text-blue-500">✓</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span>{time}</span>
                            <MoreHorizontal className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="mt-1">{content}</p>
                    <div className="flex gap-4 mt-3">
                        <button>
                            <Heart
                                className={`w-5 h-5 ${
                                    liked ? "fill-current text-red-500" : ""
                                }`}
                            />
                        </button>
                        <button>
                            <MessageCircle className="w-5 h-5" />
                        </button>
                        <button>
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    {replies > 0 && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            {replies} replies · People liked your content
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
