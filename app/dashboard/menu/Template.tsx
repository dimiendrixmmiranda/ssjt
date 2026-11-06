import BotaoDeAcao from "@/components/botaoDeAcao/BotaoDeAcao"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BiSolidLocationPlus } from "react-icons/bi"
import { BsMoon } from "react-icons/bs"
import { FaHome, FaProcedures, FaRegBell, FaUserPlus } from "react-icons/fa"
import { FaUserDoctor } from "react-icons/fa6"
import { GoGear } from "react-icons/go"
import { IoLogOutOutline } from "react-icons/io5"
import { LuUserCog } from "react-icons/lu"
import { RiServiceLine } from "react-icons/ri"
import { TbNotebook } from "react-icons/tb"

interface TemplateProps {
    children: React.ReactNode
}

export default function Template({ children }: TemplateProps) {
    const pathname = usePathname()

    async function handleSair() {
        await signOut({
            redirectTo: "/",
        })
    }

    return (
        <section className="lg:grid lg:grid-cols-[300px_1fr] min-h-screen">
            <div className="w-full h-full flex flex-col font-oswald font-bold bg-white border-r-2 border-verde-escuro">
                <div className="py-4">
                    <div className="relative w-full h-[180px]">
                        <Image alt="Logo do sistema SSJT" src={'/logo/logo-sistema-de-saude.png'} fill className="object-contain p-2" />
                    </div>
                </div>
                <div className="bg-verde h-full w-full p-4 flex flex-col gap-4">
                    <ul className="flex flex-col gap-2">
                        <li>
                            <Link href={'/dashboard'} className={`flex items-center gap-2 font-bold text-xl p-2 px-4 rounded-lg border border-verde-escuro ${pathname === '/dashboard' ? "bg-white text-verde": "bg-verde-escuro text-white"}`}>
                                <FaHome />
                                <p>Início</p>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/dashboard/menu/criar-usuario'} className={`flex items-center gap-2 font-bold text-xl p-2 px-4 rounded-lg border border-verde-escuro ${pathname === '/dashboard/menu/criar-usuario' ? "bg-white text-verde": "bg-verde-escuro text-white"}`}>
                                <FaUserPlus />
                                <p>Criar Usuário</p>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/dashboard/menu/criar-local'} className={`flex items-center gap-2 font-bold text-xl p-2 px-4 rounded-lg border border-verde-escuro ${pathname === '/dashboard/menu/criar-local' ? "bg-white text-verde": "bg-verde-escuro text-white"}`}>
                                <BiSolidLocationPlus />
                                <p>Criar Local</p>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/dashboard/menu/agenda'} className={`flex items-center gap-2 font-bold text-xl p-2 px-4 rounded-lg border border-verde-escuro ${pathname === '/dashboard/menu/agenda' ? "bg-white text-verde": "bg-verde-escuro text-white"}`}>
                                <TbNotebook />
                                <p>Agenda</p>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/dashboard/menu/criar-especialidade'} className={`flex items-center gap-2 font-bold text-xl p-2 px-4 rounded-lg border border-verde-escuro ${pathname === '/dashboard/menu/criar-especialidade' ? "bg-white text-verde": "bg-verde-escuro text-white"}`}>
                                <FaUserDoctor />
                                <p>Criar Especialidade</p>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/dashboard/menu/criar-procedimento'} className={`flex items-center gap-2 font-bold text-xl p-2 px-4 rounded-lg border border-verde-escuro ${pathname === '/dashboard/menu/criar-procedimento' ? "bg-white text-verde": "bg-verde-escuro text-white"}`}>
                                <FaProcedures />
                                <p>Criar Procedimento</p>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/dashboard/menu/criar-prestador'} className={`flex items-center gap-2 font-bold text-xl p-2 px-4 rounded-lg border border-verde-escuro ${pathname === '/dashboard/menu/criar-prestador' ? "bg-white text-verde": "bg-verde-escuro text-white"}`}>
                                <RiServiceLine />
                                <p>Criar Prestador</p>
                            </Link>
                        </li>
                    </ul>
                    <div className="mt-auto grid grid-cols-5 gap-2 w-auto">
                        <BotaoDeAcao classe="bg-amber-600 hover:text-amber-600 hover:bg-white" icone={<FaRegBell />} />
                        <BotaoDeAcao classe="bg-blue-600 hover:text-blue-600 hover:bg-white" icone={<GoGear />} />
                        <BotaoDeAcao classe="bg-zinc-600 hover:text-zinc-600 hover:bg-white" icone={<BsMoon />} />
                        <BotaoDeAcao classe="bg-green-600 hover:text-green-600 hover:bg-white" icone={<LuUserCog />} />
                        <BotaoDeAcao classe="bg-red-600 hover:text-red-600 hover:bg-white" icone={<IoLogOutOutline />} onClick={() => handleSair()} />
                    </div>
                    {/* <div className="flex items-center gap-2 bg-verde rounded-lg p-2">
                            <div className="relative rounded-full w-10 h-10 bg-zinc-800">
                                <Image alt="Imagem do Usuário" src={usuario?.imagem ? usuario.imagem : '/assets/avatar-default.png'} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col text-shadow-[1px_1px_2px_black]">
                                <h3 className="font-bold text-lg line-clamp-1">{usuario?.nome}</h3>
                                <span className="text-sm -mt-1">{usuario?.email}</span>
                            </div>
                        </div> */}
                </div>
            </div>
            <div className="min-w-0 w-full max-w-full">
                {children}
            </div>
        </section>
    )
}