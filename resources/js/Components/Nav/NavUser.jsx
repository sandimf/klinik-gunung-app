import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/Components/ui/sidebar";
import { useForm, usePage } from "@inertiajs/react";

export function NavUser() {
    const { isMobile } = useSidebar();
    const { post } = useForm();

    const user = usePage().props.auth.user;

    const handleLogout = (e) => {
        e.preventDefault();
        post(route("logout"));
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={
                                        user?.avatar
                                            ? user.avatar.startsWith("http")
                                                ? user.avatar
                                                : `/storage/${user.avatar}`
                                            : "/storage/avatar/avatar.jpg"
                                    }
                                    alt={user?.name || "Klinik gunung"}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {user?.name
                                        ? user.name.charAt(0).toUpperCase()
                                        : "CN"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={
                                            user?.avatar
                                                ? user.avatar.startsWith("http")
                                                    ? user.avatar
                                                    : `/storage/${user.avatar}`
                                                : "/storage/avatar/avatar.jpg"
                                        }
                                        alt={user?.name || "Klinik gunung"}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {user?.name
                                            ? user.name.charAt(0).toUpperCase()
                                            : "CN"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
