import { IoHomeOutline } from "react-icons/io5";
import { ImUserCheck } from "react-icons/im";
import { BsCalendarDate } from "react-icons/bs";
import { AiOutlineMedicineBox } from "react-icons/ai";

export interface Menu{
    titulo: string
    icone: React.ReactNode,
    url: string
}

export const menusDashboardAgendamento: Menu[] = [
    {
        titulo: "Início",
        icone: <IoHomeOutline />,
        url: '/agendamento'
    },
    {
        titulo: "Pacientes",
        icone: <ImUserCheck />,
        url: '/agendamento/pacientes'
    },
    {
        titulo: "Agendamento",
        icone: <AiOutlineMedicineBox />,
        url: '/agendamento/agendamento'
    },
    {
        titulo: "Agenda dos Prestadores",
        icone: <AiOutlineMedicineBox />,
        url: '/agendamento/agendaDosPrestadores'
    },
]