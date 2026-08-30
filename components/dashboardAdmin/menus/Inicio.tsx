import Image from "next/image";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

interface InicioProps {
    usuario: any
}

export default function Inicio({ usuario }: InicioProps) {
    return (
        <div className="p-4 flex flex-col gap-4 max-h-[100vh]">
            <div className="mb-4">
                <h3 className="text-2xl font-bold">Painel do {usuario.role}</h3>
            </div>
            <div className="flex items-center gap-2 p-4 rounded-lg shadow-[0px_0px_2px_1px_#999]">
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