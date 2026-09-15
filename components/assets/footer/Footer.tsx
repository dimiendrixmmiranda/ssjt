'use client'
import Image from "next/image";
import { RiAdminFill } from "react-icons/ri";
import { PiMedalFill } from "react-icons/pi";
import { FaBuildingFlag } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";
import { useEffect, useState } from "react";
import { useUsuario } from "@/hooks/useUsuario";

export default function Footer() {
    const { usuario } = useUsuario()
    const [dataHoraAtual, setDataHoraAtual] = useState(new Date());

    useEffect(() => {
        const intervalo = setInterval(() => {
            setDataHoraAtual(new Date());
        }, 1000);

        return () => clearInterval(intervalo);
    }, [])

    return (
        <footer className="col-span-2 bg-verde-escuro border-t-4 border-bs-zinc-900 p-2 grid grid-cols-[80px_280px_240px_1fr_150px_180px]  gap-4">
            <div className="relative w-20 h-full border-r border-zinc-300 pr-4">
                <Image alt="Brasao do ssjt" src={'/logo/brasao-sistema-de-saude.png'} fill className="object-contain" />
            </div>
            <div className="w-full border-r border-zinc-300 pr-4 flex justify-center items-center">
                <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 flex justify-center items-center bg-white rounded-full">
                        <RiAdminFill />
                    </div>
                    <div className="flex flex-col text-white">
                        <p className="text-sm">Usuário</p>
                        <h3 className="text-lg font-bold line-clamp-1">{usuario?.nome}</h3>
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
            <div className="w-full border-r border-zinc-300 pr-4 flex justify-center items-center 2xl:justify-center">
                <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 flex justify-center items-center bg-white rounded-full">
                        <FaBuildingFlag />
                    </div>
                    <div className="flex flex-col text-white">
                        <p className="text-sm">Local de Atendimento</p>
                        <h3 className="text-lg font-bold capitalize line-clamp-1">
                            {usuario?.unidadeDeOrigem?.nome}
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
            <div>
                <div className="relative w-40 h-full">
                    <Image alt="Brasao do ssjt" src={'/logo/sistema-de-saude-branco.png'} fill className="object-contain" />
                </div>
            </div>
        </footer>
    )
}