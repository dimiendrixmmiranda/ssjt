import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const sessao = await auth();

    if (!sessao) {
        redirect("/");
    }

    switch (sessao.user.perfil) {
        case "ADMINISTRADOR":
            redirect("/admin");

        case "MEDICO":
            redirect("/medico");

        case "RECEPCAO":
            redirect("/recepcao");

        case "AGENDAMENTO":
            redirect("/agendamento");

        case "ENFERMEIRO":
            redirect("/enfermagem");

        default:
            redirect("/");
    }
}