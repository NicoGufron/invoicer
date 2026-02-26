"use client"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { ChevronDown, FileText, Home, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../stores/auth.store";
import { useRouter } from "next/navigation";

export function AppSidebar() {
    const router = useRouter();

    const { logout } = useAuthStore();

    const handleLogout = async () => {
        const res = await logout();

        if (res) router.push("/");
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard">
                                        <Home></Home>
                                        Home
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>

                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/generate">
                                        <FileText />
                                        Generate Invoice
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/partner">
                                        <User></User>
                                        Partners
                                    </Link>
                                </SidebarMenuButton>
                                {/* <Collapsible>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton variant="outline">
                                            <User></User>
                                            Partners
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuButton>
                                                    <Link href="/dashboard/partner/create">Create Partner</Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuButton>
                                                    <Link href="/dashboard/partner/view">View Partners</Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible> */}
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className="cursor-pointer" onClick={ async () => await logout()}>
                                    {/* <Link href="/"> */}
                                    <a>

                                        <LogOut></LogOut>

                                        Logout
                                    </a>
                                    {/* </Link> */}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </SidebarHeader>
        </Sidebar>
    )
}