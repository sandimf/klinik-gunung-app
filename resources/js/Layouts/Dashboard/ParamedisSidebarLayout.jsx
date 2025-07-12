import React, { useState } from "react";
import { SidebarProvider } from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/Sidebar/ParamedisSidebar";
import { ModeToggle } from "@/Components/mode-toggle";
import { ProfileButton } from "@/Components/ProfileButton";
import { NotificationBell } from "@/Components/NotificationBell";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/Components/ui/breadcrumb";
import { Slash, Menu } from "lucide-react";
import { FlashToast } from '@/Components/ToastProvider';


export default function AdminSidebarLayout({ header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <SidebarProvider>
            {/* Sidebar for desktop */}
            <AppSidebar className="hidden md:fixed md:left-0 md:top-0 md:h-full md:w-64 md:bg-background md:border-r md:z-30 md:block" />

            {/* Sidebar for mobile (overlay) */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <AppSidebar className="relative w-64 h-full bg-background border-r z-50" onClose={() => setSidebarOpen(false)} />
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-h-screen flex flex-col md:ml-64">
                <header className="flex justify-between items-center p-4 border-b bg-background">
                    <div className="flex items-center space-x-4">
                        {/* Hamburger menu for mobile */}
                        <button
                            className="md:hidden p-2 rounded hover:bg-muted"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open sidebar"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={route("dashboard")}>
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <Slash className="w-4 h-4" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    {header && <BreadcrumbPage>{header}</BreadcrumbPage>}
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center space-x-4">
                        <NotificationBell />
                        <ModeToggle />
                        <ProfileButton />
                    </div>
                </header>
                <main className="flex-1 p-4 w-full">
                    {children}
                    <FlashToast />
                </main>
            </div>

        </SidebarProvider>
    );
}
