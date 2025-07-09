import React, { useState } from "react";
import {
    Command,
    Activity,
    Home,
    Settings2,
    Users,
    ChevronRight,
    History,
} from "lucide-react";
import { NavUser } from "@/Components/Nav/NavUser";
import { TeamSwitcher } from "@/Components/Nav/TeamSwitcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/Components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";

export function AppSidebar({ ...sidebarProps }) {
    const { url, props } = usePage();
    const auth = props.auth;

    const isRouteActive = (routeUrl) => {
        return url.startsWith(routeUrl);
    };

    const data = {
        user: auth.user,
        teams: [
            {
                name: "Klinik Gunung",
                logo: Command,
                plan: "Enterprise",
            },
        ],
        navMain: [
            {
                title: "Dashboard",
                url: route("paramedis.dashboard"),
                icon: Home,
            },
            {
                title: "Screening",
                url: route("paramedis.screenings"),
                icon: Users,
                // items: [
                //     {
                //         title: "Screening",
                //         url: route("paramedis.screenings"),
                //     },
                //     {
                //         title: "Screening Online",
                //         url: route("screening-online.paramedis"),
                //     },
                // ],
            },
            {
                title: "Riwayat Screening",
                url: route("paramedis.history"),
                icon: History,
            },
            {
                title: "Aktivitas",
                url: route("dashboard"),
                icon: Activity,
                items: [
                    {
                        title: "Aktivitas Saya",
                        url: route("report.index"),
                    },
                    {
                        title: "Aktivitas Semua Pemeriksaan",
                        url: route("activity.healthcheck"),
                    },
                ],
            },


            {
                title: "Pengaturan",
                url: route("paramedis.profile"),
                icon: Settings2,
            },
        ],
    };

    const [openItems, setOpenItems] = useState([]);

    const toggleItem = (title) => {
        setOpenItems((prev) =>
            prev.includes(title)
                ? prev.filter((item) => item !== title)
                : [...prev, title]
        );
    };

    return (
        <Sidebar collapsible="icon" {...sidebarProps}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarMenu>
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                {item.items ? (
                                    <Collapsible
                                        open={openItems.includes(item.title)}
                                        onOpenChange={() => toggleItem(item.title)}
                                        className="group/collapsible"
                                    >
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={isRouteActive(item.url)}
                                                className={isRouteActive(item.url) ? "bg-muted text-primary" : ""}
                                            >
                                                {item.icon && <item.icon className="size-4" />}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            isActive={isRouteActive(subItem.url)}
                                                            asChild
                                                        >
                                                            <Link
                                                                href={subItem.url}
                                                                className={`flex items-center w-full ${isRouteActive(subItem.url) ? "bg-muted text-primary" : ""}`}
                                                            >
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={isRouteActive(item.url)}
                                        asChild
                                        className={isRouteActive(item.url) ? "bg-muted text-primary" : ""}
                                    >
                                        <Link
                                            href={item.url}
                                            className="flex items-center w-full"
                                        >
                                            {item.icon && <item.icon className="size-4" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
