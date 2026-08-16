'use client'

import formatarDataHora from "@/utils/formatarDataHora";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Inicio() {
    const [dataHora, setDataHora] = useState(new Date());

    useEffect(() => {
        const intervalo = setInterval(() => {
            setDataHora(new Date())
        }, 1000)

        return () => clearInterval(intervalo)
    }, [])

    return (
        <div className="p-4 flex flex-col gap-4 text-verde-escuro 2xl:p-8">
            <div className=" flex justify-between">
                <h3 className="text-2xl font-bold">Painel do Super Administrador</h3>
                <div>
                    <p>
                        {formatarDataHora(dataHora)}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 p-4 rounded-lg shadow-[0px_0px_2px_1px_#306D29]">
                <div className="relative w-16 h-20">
                    <Image alt="Brasao SSJT" src={'/logo/brasao.png'} fill className="object-contain" />
                </div>
                <div>
                    <h4 className="text-2xl">Bem Vindo, <b>Super Administrador!</b></h4>
                    <span>Gerencie todos os recursos do sistema de saúde.</span>
                </div>
            </div>
            <div className="flex flex-col gap-4 p-4 rounded-lg shadow-[0px_0px_2px_1px_#306D29]">
                <h4 className="font-black text-xl">Ações Rápidas</h4>
                ....
                {/* <div>
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
                </div> */}
            </div>
        </div>
    )
}