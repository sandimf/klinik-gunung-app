"use client";

import React, { useState } from "react";
import {
    Command,
    FileClock,
    Home,
    Settings2,
    ShoppingBag,
    Users,
    ChevronRight,
    Pill,
    CreditCard,
    ChartPie,
    ChartArea,
    ShoppingBagIcon,
    ShoppingBasket,
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
import { TooltipProvider } from '@/Components/ui/tooltip';

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
                url: route("cashier.dashboard"),
                icon: Home,
            },

            {
                title: "Aktivitas Pelayanan",
                url: route("dashboard"),
                icon: CreditCard,
                items: [
                    {
                        title: "Screening",
                        url: route("cashier.screening"),
                    },
                    {
                        title: "Pendampingan Medis",
                        url: route("companion.screening"),
                    },
                    {
                        title: "Konsultasi Dokter",
                        url: route("cashier.consultation"),
                    },
                ],
            },
            

            {
                title: "Penjualan",
                url: route("product.cashier"),
                icon: ShoppingBasket,
                items: [
                    {
                        title: "Produk",
                        url: route("cashier.transcation"),
                    },
                    {
                        title: "Riwayat Penjualan",
                        url: route("product.history.checkout"),
                    },
                ],
            },
            {
                title: "Apotek",
                url: "#",
                icon: Pill,
                items: [
                    {
                        title: "Obat",
                        url: route("medicine.index"),
                    },
                    {
                        title: "Import Obat",
                        url: route("import.apotek"),
                    },
 
                ],
            },
            {
                title: "Produk",
                url: route("product.cashier"),
                icon: ShoppingBagIcon,
            },
            {
                title: "Office",
                url: route("office.index"),
                icon: ChartPie,
            },
            {
                title: "Pengaturan",
                url: route("cashier.profile"),
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
        <TooltipProvider delayDuration={0}>
            <Sidebar {...sidebarProps}>
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
                <SidebarRail />
            </Sidebar>
        </TooltipProvider>
    );
}
