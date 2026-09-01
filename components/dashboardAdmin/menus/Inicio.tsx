'use client'
import { Oi } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { MdCalendarMonth } from "react-icons/md";

interface InicioProps {
    usuario: any
}

export default function Inicio({ usuario }: InicioProps) {
    const [dataHoraAtual, setDataHoraAtual] = useState(new Date());
    useEffect(() => {
        const intervalo = setInterval(() => {
            setDataHoraAtual(new Date());
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);


    return (
        <div className="p-4 flex flex-col gap-4 max-h-[100vh]">
            <div className="flex items-center gap-6">
                <div className="flex items-center my-auto">
                    <h3 className="text-3xl font-bold">Painel do {usuario.role}</h3>
                </div>
                <div className="rounded-lg border border-zinc-400 flex items-center gap-2 p-2 ml-auto">
                    <MdCalendarMonth className="text-4xl text-verde-escuro" />
                    <div className="flex flex-col text-black max-w-[200px]">
                        <span className="text-sm font-semibold text-verde-escuro">
                            {dataHoraAtual.toLocaleDateString("pt-BR")}
                        </span>

                        <span className="text-xs">
                            {dataHoraAtual.toLocaleTimeString("pt-BR")}
                        </span>
                    </div>
                </div>
                <div className="relative w-40 h-15">
                    <Image alt="logo sistema" src={'/logo/sistema-de-saude.png'} fill className="object-contain" />
                </div>
            </div>
            <div className="relative flex items-center gap-2 p-4 rounded-lg shadow-[0px_0px_2px_1px_#999] overflow-hidden">
                <div className="absolute right-0 -bottom-2.5 w-[55%] h-full pointer-events-none">
                    <Image
                        src="/predio-fundo.png"
                        alt=""
                        fill
                        className="object-contain object-right-bottom"
                    />
                </div>
                <div className="relative w-16 h-20">
                    <Image alt="Brasao SSJT" src={'/logo/brasao.png'} fill className="object-contain" />
                </div>
                <div>
                    <h4 className="text-2xl">Bem Vindo (a), <b>{usuario.name}</b></h4>
                    <span>Gerencie todos os recursos do sistema de saúde.</span>
                </div>
            </div>
            <div className="flex flex-col gap-4 p-4 rounded-lg shadow-[0px_0px_2px_1px_#999]">
                <h4 className="font-black text-xl">Ações Rápidas</h4>
                aqui bem legal
                <div>
                    <ul className="grid grid-cols-2">
                        <li>
                            <Link href={'/super-admin/criar-usuario-adm '} className="flex items-center gap-2 p-2 bg-verde rounded-lg w-fit text-white">
                                <FaUserPlus className="text-3xl" />
                                <div className="flex flex-col">
                                    <p className="font-bold text-lg">Criar Usuário Administrador</p>
                                    <span className="text-sm -mt-1">Cadastre um novo administrador</span>
                                </div>
                                <IoIosArrowForward className="text-xl" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}