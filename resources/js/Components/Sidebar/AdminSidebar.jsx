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
    Bot,
    Key,
    Contact,
    DollarSign
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
import { cn } from '@/lib/utils';
import {
    TooltipProvider,
} from '@/Components/ui/tooltip';



export function AppSidebar({ ...sidebarProps }) {
    const { url, props } = usePage();
    const auth = props.auth;

    const [collapsed, setCollapsed] = useState(false);

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
                title: "Kuesioner Screening",
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
                url: route("staff.index"),
                icon: UserPlus,
            },
            {
                title: "Harga Screening",
                url: route("amounts.index"),
                icon: DollarSign,
            },
            {
                title: "Pindai QrCode",
                url: route("admin.scan"),
                icon: Scan,
            },
            {
                title: "Kontak Darurat",
                url: route("emergecy-contact.index"),
                icon: Contact,
            },
            {
                title: "Ai Apikey",
                url: route("apikey.index"),
                icon: Key,
            },
            {
                title: "Auth",
                url: route("dashboard"),
                icon: Ghost,
                items: [
                    {
                        title: "Social Login",
                        url: route("apikey.index"),
                        icon: Key,

                    },
                ],
            },
            {
                title: "Chat AI",
                url: route("chatbot.admin"),
                icon: Bot,

            },
            {
                title: "Pengaturan",
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

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const linkClasses = (isActive, isCollapsed) =>
        cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            isActive && 'bg-muted text-primary',
            isCollapsed && 'justify-center'
        );

    const iconClasses = 'h-5 w-5';
    const labelClasses = (isCollapsed) => cn('truncate', isCollapsed && 'hidden');

    return (
        <TooltipProvider delayDuration={0}>
            <Sidebar collapsed={collapsed} {...sidebarProps}>
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
                                                >
                                                    {item.icon && (
                                                        <item.icon className="size-4" />
                                                    )}
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
                                                                    className="flex items-center w-full"
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
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser user={data.user} />
                </SidebarFooter>
                <SidebarRail onClick={toggleSidebar} />
            </Sidebar>
        </TooltipProvider>
    );
}
