import { IoHomeOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaRegBuilding } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { LiaProceduresSolid } from "react-icons/lia";
import { RiServiceFill } from "react-icons/ri";

export interface Menu{
    titulo: string
    icone: React.ReactNode,
    url: string
}

export const menusDashboardAdmin: Menu[] = [
    {
        titulo: "Início",
        icone: <IoHomeOutline />,
        url: '/admin'
    },
    {
        titulo: "Usuário",
        icone: <FaRegUser />,
        url: '/admin/usuario'
    },
    {
        titulo: "Médico",
        icone: <FaUserDoctor />,
        url: '/admin/medico'
    },
    {
        titulo: "Especialidade",
        icone: <MdOutlineMedicalServices />,
        url: '/admin/especialidade'
    },
    {
        titulo: "Procedimentos",
        icone: <LiaProceduresSolid />,
        url: '/admin/procedimento'
    },
    {
        titulo: "Locais de Atendimento",
        icone: <FaRegBuilding />,
        url: '/admin/localDeAtendimento'
    },
    {
        titulo: "Prestador",
        icone: <RiServiceFill />,
        url: '/admin/prestador'
    },
    {
        titulo: "Relatórios",
        icone: <TbReportAnalytics />,
        url: '/'
    },

]