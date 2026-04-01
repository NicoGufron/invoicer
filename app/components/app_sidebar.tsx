"use client"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { ChevronDown, FileText, Home, LogOut, User, Users } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../stores/auth.store";
import { usePathname, useRouter } from "next/navigation";

export function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const { logout } = useAuthStore();

    const handleLogout = async () => {
        const res = await logout();

        if (res) router.push("/login");
    }

    const getLink = (path: string, isLogout: boolean) => {
        const baseClass = "font-semibold py-3 bg-transparent flex flex-row gap-2 items-center rounded-lg text-sm";

        if (isLogout) {
            return `${baseClass} cursor-pointer hover:bg-red-600 text-[#FF0000] hover:text-white`;
        }

        const isActive = pathname === path;
        const activeClasses = "bg-[#25343F] text-white hover:";
        const inactiveClasses = "text-black";

        return `${baseClass} ${isActive ? activeClasses : inactiveClasses}`;
    }

    return (
        <Sidebar>
            <SidebarHeader >
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className={getLink("/dashboard/home", false)}>
                                    <Link href="/dashboard/home">
                                        <Home></Home>
                                        Home
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className={getLink("/dashboard/profile", false)}>
                                    <Link href="/dashboard/profile">
                                    <User></User>
                                    Profile
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                {/* <SidebarMenuButton> */}
                                    <Collapsible>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton variant="outline" className="font-semibold">
                                                <FileText></FileText>
                                                Invoice
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuButton className={getLink("/dashboard/invoice/create", false)}>
                                                        <Link href="/dashboard/invoice/create">Create Invoice</Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuButton className={getLink("/dashboard/invoice/view", false)}>
                                                        <Link href="/dashboard/invoice/view">View Invoice</Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </Collapsible>
                                    {/* <Link href="/dashboard/generate">
                                        <FileText />
                                        Invoice
                                    </Link> */}
                                {/* </SidebarMenuButton> */}
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className={getLink("/dashboard/partner", false)}>
                                    <Link href="/dashboard/partner">
                                        <Users></Users>
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
                                <SidebarMenuButton asChild className={getLink("", true)} onClick={handleLogout}>
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