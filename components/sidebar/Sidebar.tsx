'use client'
import Image from "next/image";
import BotaoDeAcao from "../assets/botaoDeAcao/BotaoDeAcao";
import { FaRegBell } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { signOut } from "next-auth/react";
import { LuUserCog } from "react-icons/lu";
import { BsMoon } from "react-icons/bs";
import { GoGear } from "react-icons/go";
import { Menu, menusDashboardAdmin } from "@/lib/menusDashboardAdmin";
import GerarBotaoSidebar from "@/lib/gerarBotaoSidebar";
import { usePathname } from "next/navigation";
import { useUsuario } from "@/hooks/useUsuario";
import { useDialog } from "@/context/DialogContext";

interface SidebarProps {
    menuDashboard: Menu[]
}

export default function Sidebar({ menuDashboard }: SidebarProps) {
    const pathname = usePathname()
    const { usuario } = useUsuario()
    const { abrirDialog } = useDialog()
    const sair = () => {
        abrirDialog({
            title: "Sair do sistema",
            message: "Deseja realmente sair do sistema?",
            confirmText: "Sair",
            cancelText: "Cancelar",

            onConfirm: async () => {
                await signOut({
                    callbackUrl: "/"
                })
            },
        })
    }

    return (
        <nav className="w-full h-full grid grid-rows-[180px_1fr] border-r border-verde-escuro col-start-1 col-end-2">
            <div className="p-4">
                <div className="relative w-full h-full bg-white">
                    <Image alt="Logo do sistema SSJT" src={'/logo/logo-sistema-de-saude.png'} fill className="object-contain" />
                </div>
            </div>
            <div className="text-white w-full h-full p-4 flex flex-col gap-4 bg-verde-escuro">
                <div className="bg-verde-escuro text-white w-full p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2 font-oswald ml-3 -mb-2">
                        <p>Menu Principal</p>
                    </div>
                </div>
                <div>
                    <ul className="flex flex-col gap-2">
                        {menuDashboard.map((menu: Menu, i: number) => {

                            const ativo = pathname === menu.url;

                            return GerarBotaoSidebar(
                                menu.icone,
                                menu.titulo,
                                menu.url,
                                i,
                                ativo
                            );
                        })}
                    </ul>
                </div>
                <div className="mt-auto grid grid-cols-5 gap-2 w-auto">
                    <BotaoDeAcao classe="bg-amber-600 hover:text-amber-600 hover:bg-white" icone={<FaRegBell />} />
                    <BotaoDeAcao classe="bg-blue-600 hover:text-blue-600 hover:bg-white" icone={<GoGear />} />
                    <BotaoDeAcao classe="bg-zinc-600 hover:text-zinc-600 hover:bg-white" icone={<BsMoon />} />
                    <BotaoDeAcao classe="bg-green-600 hover:text-green-600 hover:bg-white" icone={<LuUserCog />} />
                    <BotaoDeAcao classe="bg-red-600 hover:text-red-600 hover:bg-white" icone={<IoLogOutOutline />} onClick={() => sair()} />
                </div>
                <div className="flex items-center gap-2 bg-verde rounded-lg p-2">
                    <div className="relative rounded-full w-10 h-10 bg-zinc-800">
                        <Image alt="Imagem do Usuário" src={usuario?.imagem ? usuario.imagem : '/assets/avatar-default.png'} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col text-shadow-[1px_1px_2px_black]">
                        <h3 className="font-bold text-lg line-clamp-1">{usuario?.nome}</h3>
                        <span className="text-sm -mt-1">{usuario?.email}</span>
                    </div>
                </div>
            </div>
        </nav>
    )
}