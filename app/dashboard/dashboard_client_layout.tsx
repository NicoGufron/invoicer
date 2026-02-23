import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/app_sidebar"

export default function DashboardClientLayout({
    initialUser,
    children,
}: {
    initialUser: any,
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar></AppSidebar>
            <SidebarInset>
                <header className="flex h-16 items-center gap-4 border-b bg-background px-4">
                    <SidebarTrigger />
                </header>
                <main className="flex-1 bg-[#F6F6F8]">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}