'use client'
import Image from "next/image";
import { IoHomeOutline } from "react-icons/io5";
import { LuShieldPlus } from "react-icons/lu";
import BotaoLogout from "../assets/botaoLogout";
import { useState } from "react";
import Inicio from "./menus/Inicio";
import Usuario from "./menus/Usuario";
import Medico from "./menus/Medico";
import Especialidade from "./menus/Especialidade";
import { FaRegBuilding, FaRegCalendarCheck, FaRegUser } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { MdOutlineMedicalServices } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { GoGear } from "react-icons/go";

interface DashboardSuperAdminProps {
    usuario: any
}

export default function DashboardSuperAdmin({ usuario }: DashboardSuperAdminProps) {
    const [menuAtivo, setMenuAtivo] = useState('inicio')

    const renderizarMenu = () => {
        switch (menuAtivo) {
            case 'inicio':
                return (
                    <Inicio />
                )
            case 'usuario':
                return (
                    <Usuario />
                )
            case 'medico':
                return (
                    <Medico />
                )
            case 'especialidade':
                return (
                    <Especialidade />
                )
            default:
                break;
        }
    }

    const gerarBotaoMenu = (
        icone: React.ReactNode,
        nomeMenu: string,
        valorMenu: string
    ) => {
        return (
            <li key={valorMenu}>
                <button
                    onClick={() => setMenuAtivo(valorMenu)}
                    className={`flex items-center gap-2 text-lg font-bold w-full p-2 rounded-lg transition-all duration-300 cursor-pointer
                    ${menuAtivo === valorMenu
                            ? "bg-green-100 text-green-800"
                            : "hover:bg-green-100 hover:text-verde"
                        }
                `}
                >
                    {icone}
                    <span>{nomeMenu}</span>
                </button>
            </li>
        )
    }

    const menus = [
        {
            nome: "Início",
            valor: "inicio",
            icone: <IoHomeOutline />,
        },
        {
            nome: "Usuário",
            valor: "usuario",
            icone: <FaRegUser />,
        },
        {
            nome: "Médico",
            valor: "medico",
            icone: <FaUserDoctor />,
        },
        {
            nome: "Especialidade",
            valor: "especialidade",
            icone: <MdOutlineMedicalServices />,
        },
        {
            nome: "Locais de Atendimento",
            valor: "locais",
            icone: <FaRegBuilding />,
        },
        {
            nome: "Agendamentos",
            valor: "agendamentos",
            icone: <FaRegCalendarCheck />,
        },
        {
            nome: "Relatórios",
            valor: "relatorios",
            icone: <TbReportAnalytics />,
        },
        {
            nome: "Configurações",
            valor: "configuracoes",
            icone: <GoGear />,
        },
    ]

    return (
        <main className="grid grid-cols-[300px_1fr] w-full min-h-screen font-arimo">
            <div className="w-full h-full grid grid-rows-[180px_1fr] border-r border-verde-escuro">
                <div className="p-4">
                    <div className="relative w-full h-full bg-white">
                        <Image alt="Logo do sistema SSJT" src={'/logo/logo-sistema.png'} fill className="object-contain" />
                    </div>
                </div>
                <div className="text-white w-full h-full p-4 flex flex-col gap-4 bg-verde-escuro">
                    <div className="flex items-center justify-center gap-2 text-xl font-bold">
                        <LuShieldPlus />
                        <p>Super Administrador</p>
                    </div>
                    <div>
                        <ul className="flex flex-col gap-2">
                            {menus.map((menu) =>
                                gerarBotaoMenu(
                                    menu.icone,
                                    menu.nome,
                                    menu.valor
                                )
                            )}
                        </ul>
                    </div>
                    <div className="mt-auto">
                        <BotaoLogout />
                    </div>
                    <div className="flex items-center gap-2 bg-verde rounded-lg p-2">
                        <div className="rounded-full w-10 h-10 bg-zinc-900"></div>
                        <div className="flex flex-col text-shadow-[1px_1px_2px_black]">
                            <h3 className="font-bold text-lg">Super Administrador</h3>
                            <span className="text-sm -mt-1">admin@ssjt.com</span>
                        </div>
                    </div>
                </div>
            </div>
            <>
                {
                    renderizarMenu()
                }
            </>
        </main>
    )
}