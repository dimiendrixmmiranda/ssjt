'use client'
import Image from "next/image";
import { IoHomeOutline } from "react-icons/io5";
import { LuShieldPlus, LuUserCog } from "react-icons/lu";
import BotaoLogout from "../assets/botaoLogout";
import { useEffect, useState } from "react";
import Inicio from "./menus/Inicio";
import Pacientes from "./menus/Pacientes";
import { FaRegBell, FaUserPlus } from "react-icons/fa";
import ConsultasEExames from "./menus/ConsultasEExames";
import { RiAdminFill } from "react-icons/ri";
import { PiMedalFill } from "react-icons/pi";
import { FaBuildingFlag } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";
import formatarDataHora from "@/utils/formatarDataHora";
import { useLocais } from "@/hooks/useLocais";
import { useUsuarios } from "@/hooks/useUsuarios";
import { GoGear } from "react-icons/go";
import { BsMoon } from "react-icons/bs";

interface DashboardAdminProps {
    usuario: any
}

export default function DashboardAdmin({ usuario }: DashboardAdminProps) {
    const [menuAtivo, setMenuAtivo] = useState('inicio')
    const { usuarios } = useUsuarios()
    const usuarioAtual = usuarios.find(user => user.id === usuario.id)
    const [dataHoraAtual, setDataHoraAtual] = useState(new Date());
    const { locais } = useLocais()
    const acharLocal = (localId: string) => {
        return locais.find(local => local.id === localId)
    }

    useEffect(() => {
        const intervalo = setInterval(() => {
            setDataHoraAtual(new Date());
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

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
            case 'consultas-e-exames':
                return (
                    <ConsultasEExames />
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
        {
            nome: "Consultas e Exames",
            valor: "consultas-e-exames",
            icone: <FaUserPlus />,
        },
    ]

    return (
        <>
            <div className="grid grid-cols-[270px_1fr] grid-rows-[1fr_75px] w-full min-h-screen">
                <nav className="w-full h-full grid grid-rows-[180px_1fr] border-r border-verde">
                    <div className="p-4">
                        <div className="relative w-full h-full bg-white">
                            <Image alt="Logo do sistema SSJT" src={'/logo/logo-sistema.png'} fill className="object-contain" />
                        </div>
                    </div>
                    <div className="bg-verde-escuro text-white w-full h-full p-4 flex flex-col gap-4">
                        <div className="flex items-center gap-2 font-oswald ml-3 -mb-2">
                            <p>Menu Principal</p>
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
                        <div className="mt-auto grid grid-cols-5 gap-2 ml-auto w-auto">
                            <button className="w-[40px] h-[40px] bg-amber-600 flex justify-center items-center rounded-lg text-xl transition-all border border-amber-600 duration-200 hover:text-amber-600 hover:bg-white">
                                <FaRegBell />
                            </button>
                            <button className="w-[40px] h-[40px] bg-zinc-950 flex justify-center items-center rounded-lg text-xl transition-all border border-zinc-bg-zinc-950 duration-200 hover:text-zinc-950 hover:bg-white">
                                <BsMoon />
                            </button>
                            <button className="w-[40px] h-[40px] bg-blue-600 flex justify-center items-center rounded-lg text-xl transition-all border border-blue-600 duration-200 hover:text-blue-600 hover:bg-white">
                                <GoGear />
                            </button>
                            <button className="w-[40px] h-[40px] bg-verde flex justify-center items-center rounded-lg text-xl transition-all border border-verde duration-200 hover:text-verde hover:bg-white">
                                <LuUserCog />
                            </button>
                            <BotaoLogout />
                        </div>
                        <div className="flex items-center gap-2 bg-verde p-2 rounded-xl">
                            <div className="rounded-full w-10 h-10 bg-zinc-900"></div>
                            <div className="flex flex-col text-shadow-[1px_1px_2px_black]">
                                <h3 className="font-bold">Super Administrador</h3>
                                <span className="text-sm -mt-1">admin@ssjt.com</span>
                            </div>
                        </div>
                    </div>
                </nav>
                <>
                    {
                        renderizarMenu()
                    }
                </>
                <footer className="col-span-2 bg-verde-escuro border-t-4 border-bs-zinc-900 p-2 grid grid-cols-[80px_320px_200px_1fr_150px_180px]  gap-4">
                    <div className="relative w-20 h-full border-r border-zinc-300 pr-4">
                        <Image alt="Brasao do ssjt" src={'/logo/brasao.png'} fill className="object-contain" />
                    </div>
                    <div className="w-full border-r border-zinc-300 pr-4 flex justify-center items-center">
                        <div className="flex items-center gap-2">
                            <div className="relative w-10 h-10 flex justify-center items-center bg-white rounded-full">
                                <RiAdminFill />
                            </div>
                            <div className="flex flex-col text-white">
                                <p className="text-sm">Usuário</p>
                                <h3 className="text-lg font-bold">{usuario.name}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="w-full border-r border-zinc-300 pr-4 flex justify-center items-center">
                        <div className="flex items-center gap-2">
                            <div className="relative w-10 h-10 flex justify-center items-center bg-white rounded-full">
                                <PiMedalFill />
                            </div>
                            <div className="flex flex-col text-white">
                                <p className="text-sm">Competência</p>
                                <h3 className="text-lg font-bold capitalize">
                                    {new Date().toLocaleDateString('pt-BR', { month: 'long' })}, {new Date().getFullYear()}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="w-full border-r border-zinc-300 pr-4 flex">
                        <div className="flex items-center gap-2">
                            <div className="relative w-10 h-10 flex justify-center items-center bg-white rounded-full">
                                <FaBuildingFlag />
                            </div>
                            <div className="flex flex-col text-white">
                                <p className="text-sm">Local</p>
                                <h3 className="text-lg font-bold capitalize line-clamp-1">
                                    {usuarioAtual?.localId
                                        ? acharLocal(usuarioAtual.localId)?.nome
                                        : "Local não definido"}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="w-full border-r border-zinc-300 pr-4 my-auto h-full flex justify-center items-center">
                        <div className="flex items-center gap-2">
                            <div className="relative w-10 h-10 flex justify-center items-center bg-white rounded-full">
                                <MdCalendarMonth />
                            </div>

                            <div className="flex flex-col text-white max-w-[200px]">
                                <span className="text-sm font-semibold">
                                    {dataHoraAtual.toLocaleDateString("pt-BR")}
                                </span>

                                <span className="text-xs">
                                    {dataHoraAtual.toLocaleTimeString("pt-BR")}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="relative w-40 h-full">
                        <Image alt="Brasao do ssjt" src={'/logo/sistema-de-saude-branco.png'} fill className="object-contain" />
                    </div>
                </footer>
            </div>
        </>
    )
}