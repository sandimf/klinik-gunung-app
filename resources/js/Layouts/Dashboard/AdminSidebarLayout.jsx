import React from "react";
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/Sidebar/AdminSidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { ChevronRight, Slash } from "lucide-react";
import PageContainer from "./PageContainer";
import { ModeToggle } from "@/Components/mode-toggle";
import { ProfileButton } from "@/Components/ProfileButton";

export default function Layout({ header, children }) {
    return (
        <SidebarProvider>
            <AppSidebar className="bg-background" />
            <SidebarInset>
                <main>
                    <header className="flex justify-between items-center p-4 border-b">
                        <div className="flex items-center space-x-4">
                            <SidebarTrigger />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink
                                            href={route("dashboard")}
                                        >
                                            Dashboard
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        <Slash className="w-4 h-4" />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        {header && (
                                            <BreadcrumbPage>
                                                {header}
                                            </BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ModeToggle />
                            <ProfileButton />
                        </div>
                    </header>

                    {/* Content area with PageContainer */}
                    <div className="min-h-[100vh] flex-1 rounded-xl">
                        <PageContainer>{children}</PageContainer>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
