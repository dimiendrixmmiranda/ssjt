import { redirect } from "next/navigation";

export function redirecionarPorPerfil(perfil: string) {
    switch (perfil) {
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
            redirect("/dashboard");
    }
}