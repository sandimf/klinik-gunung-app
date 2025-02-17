import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/Sidebar/WarehouseSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import PageContainer from "./PageContainer";
import { ModeToggle } from "@/Components/mode-toggle";
import { NotificationButton } from "@/Components/NotificationButton";
import { ProfileButton } from "@/Components/ProfileButton";

export default function Layout({
  header,
  children
}){
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main>
          {/* Header section with Sidebar Trigger and Breadcrumb */}
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={route("dashboard")}>
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {header && <BreadcrumbPage>{header}</BreadcrumbPage>}
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
