'use client'
import Image from "next/image";
import { IoHomeOutline } from "react-icons/io5";
import { LuShieldPlus } from "react-icons/lu";
import BotaoLogout from "../assets/botaoLogout";
import { useState } from "react";
import Inicio from "./menus/Inicio";
import Pacientes from "./menus/Pacientes";
import { FaUserPlus } from "react-icons/fa";

interface DashboardAdminProps {
    usuario: any
}

export default function DashboardAdmin({ usuario }: DashboardAdminProps) {
    const [menuAtivo, setMenuAtivo] = useState('inicio')

    const renderizarMenu = () => {
        switch (menuAtivo) {
            case 'inicio':
                return (
                    <Inicio usuario={usuario} />
                )
            case 'pacientes':
                return (
                    <Pacientes />
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
                            ? "bg-green-200 text-green-800"
                            : "hover:bg-green-200 hover:text-verde"
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
            nome: "Pacientes",
            valor: "pacientes",
            icone: <FaUserPlus />,
        },
    ]

    return (
        <main className="grid grid-cols-[250px_1fr] w-full min-h-screen">
            <div className="w-full h-full grid grid-rows-[180px_1fr] border-r border-verde">
                <div className="p-4">
                    <div className="relative w-full h-full bg-white">
                        <Image alt="Logo do sistema SSJT" src={'/logo/logo-sistema.png'} fill className="object-contain" />
                    </div>
                </div>
                <div className="bg-verde text-white w-full h-full p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-xl font-bold">
                        <LuShieldPlus />
                        <p>{usuario.role}</p>
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
                    <div className="mt-4">
                        <BotaoLogout />
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                        <div className="rounded-full w-10 h-10 bg-zinc-900"></div>
                        <div className="flex flex-col">
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