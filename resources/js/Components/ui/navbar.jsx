import { Link, router } from "@inertiajs/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Menu, ChevronDown } from "lucide-react";
import { ModeToggle } from "@/Components/mode-toggle";
import { MountainIcon } from "@/Components/ui/mountain-icon";

export function Navbar({ children, user }) {
    function handleLogout() {
        router.post(route('logout'));
    }
    return (
        <>
            <nav className="sticky top-0 z-30 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between h-16 px-4 md:px-8 max-w-7xl mx-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-900 dark:bg-gray-100">
                            <MountainIcon className="w-5 h-5 text-white dark:text-gray-900" />
                        </span>
                        <span className="font-bold text-lg tracking-tight">Klinik Gunung</span>
                    </div>
                    {/* Menu */}
                    <div className="hidden md:flex items-center gap-4 ml-8">
                        <Link href="#" className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link>
                        <Link href="#" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">Orders <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full ml-1">2</span></Link>
                        <Link href="#" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Products</Link>
                        <Link href="#" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Customers</Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none">
                                    Settings <ChevronDown className="w-4 h-4 ml-1" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Account</DropdownMenuItem>
                                <DropdownMenuItem>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {/* Search */}
                    <div className="flex-1 flex justify-center md:justify-end mx-4">
                        {/* (search bar hidden for now) */}
                    </div>
                    {/* Profile & Login */}
                    <div className="ml-auto flex gap-4 sm:gap-6 items-center">
                        <ModeToggle />
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <span className="cursor-pointer">
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    user.avatar
                                                        ? user.avatar.startsWith("http")
                                                            ? user.avatar
                                                            : `/storage/${user.avatar}`
                                                        : "/storage/avatar/avatar.svg"
                                                }
                                                alt={user.name || "User"}
                                            />
                                            <AvatarFallback className="rounded-lg">{user.name ? user.name.charAt(0).toUpperCase() : "CN"}</AvatarFallback>
                                        </Avatar>
                                    </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={route('dashboard')}>Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>Keluar</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href={route('login')} className="font-medium hover:underline">Login</Link>
                        )}
                    </div>
                </div>
            </nav>
            {children}
        </>
    );
} 