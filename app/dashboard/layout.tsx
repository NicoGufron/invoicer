import DashboardClientLayout from "./dashboard_client_layout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    // const user = await getServerUser();

    return (
        <DashboardClientLayout initialUser={null}>
            {children}
        </DashboardClientLayout>
    )
}