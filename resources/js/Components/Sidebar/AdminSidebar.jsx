import React, { useState } from "react";
import {
    Command,
    Home,
    UserPlus,
    Settings2,
    ChevronRight,
    NotebookPen,
    Scan,
    Ghost,
    Key,
    Contact,
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
                url: route("admin.dashboard"),
                icon: Home,
            },
            {
                title: "Kuesioner",
                url: route("questioner.create"),
                icon: NotebookPen,
                items: [
                    {
                        title: "Kuesioner",
                        url: route("questioner.index"),
                    },
                    {
                        title: "Kuesioner Online",
                        url: route("questioner-online.index"),
                    },
                ],
            },
            {
                title: "Staff",
                url: route("dashboard"),
                icon: UserPlus,
                items: [
                    {
                        title: "Daftar Staff",
                        url: route("staff.index"),
                    },
                ],
            },
            {
                title: "Scan",
                url: route("admin.scan"),
                icon: Scan,
            },
            {
                title: "Auth",
                url: route("dashboard"),
                icon: Ghost,
                items: [
                    {
                        title: "Social Login",
                        url: route("auth-settings.index"),
                    },
                ],
            },
            {
                title: "Apikey",
                url: route("apikey.index"),
                icon: Key,
            },
            {
                title: "Emergency Contact",
                url: route("emergecy-contact.index"),
                icon: Contact,
            },
            {
                title: "Settings",
                url: route("admin.profile"),
                icon: Settings2,
                items: [
                    {
                        title: "Profile",
                        url: route("admin.profile"),
                    },
                ],
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
        <Sidebar collapsible="icon " {...sidebarProps}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarMenu>
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <Collapsible
                                    open={openItems.includes(item.title)}
                                    onOpenChange={() => toggleItem(item.title)}
                                    className="group/collapsible"
                                >
                                    <CollapsibleTrigger asChild>
                                        {item.items ? (
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={isRouteActive(
                                                    item.url
                                                )}
                                            >
                                                {item.icon && (
                                                    <item.icon className="size-4" />
                                                )}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        ) : (
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={isRouteActive(
                                                    item.url
                                                )}
                                                asChild
                                            >
                                                <Link
                                                    href={item.url}
                                                    className="flex items-center w-full"
                                                >
                                                    {item.icon && (
                                                        <item.icon className="size-4" />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        )}
                                    </CollapsibleTrigger>
                                    {item.items && (
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((subItem) => (
                                                    <SidebarMenuSubItem
                                                        key={subItem.title}
                                                    >
                                                        <SidebarMenuSubButton
                                                            isActive={isRouteActive(
                                                                subItem.url
                                                            )}
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    subItem.url
                                                                }
                                                                className="flex items-center w-full"
                                                            >
                                                                <span>
                                                                    {
                                                                        subItem.title
                                                                    }
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    )}
                                </Collapsible>
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
