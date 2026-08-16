import { auth } from "@/auth";
import DashboardSuperAdmin from "@/components/dashboardSuperAdmin/DashboardSuperAdmin";
import { redirect } from "next/navigation";

export default async function SuperAdminPage() {
    const session = await auth();
    const usuario = session?.user
    if (!session?.user) {
        redirect("/");
    }

    if (session.user.role !== "SUPER_ADMIN") {
        redirect("/admin");
    }

    console.log(session)

    return (
        <DashboardSuperAdmin usuario={usuario}/>
    )
}