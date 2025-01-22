import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { usePage,useForm } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";


export function ProfileButton() {
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post(route("logout"));
    };
    
    const user = usePage().props.auth.user;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage
                        src={
                            user?.avatar
                                ? user.avatar.startsWith("http")
                                    ? user.avatar
                                    : `/storage/${user.avatar}`
                                : "/storage/avatar/avatar.svg"
                        }
                        alt={user?.name || "Klinik gunung"}
                    />
                    <AvatarFallback className="rounded-lg">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "CN"}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
