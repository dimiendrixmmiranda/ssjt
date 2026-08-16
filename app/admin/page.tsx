import { auth } from "@/auth";
import DashboardAdmin from "@/components/dashboardAdmin/DashboardAdmin";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const session = await auth();
    const usuario = session?.user

    if (!session?.user) {
        redirect("/");
    }

    if (
        session.user.role !== "ADMIN" &&
        session.user.role !== "SUPER_ADMIN"
    ) {
        redirect("/");
    }

    return (
        <DashboardAdmin usuario={usuario} />
    )
}