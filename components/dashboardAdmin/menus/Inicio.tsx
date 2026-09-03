'use client'
import { Oi } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { FaMapPin, FaPlus, FaUserPlus } from "react-icons/fa";
import { FiBookOpen, FiFileText, FiGlobe, FiHelpCircle, FiLink } from "react-icons/fi";
import { HiMiniUsers, HiOutlineCalendarDateRange } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { MdCalendarMonth } from "react-icons/md";

interface InicioProps {
    usuario: any
}

export default function Inicio({ usuario }: InicioProps) {
    const [dataHoraAtual, setDataHoraAtual] = useState(new Date())
    const [menuAtivo, setMenuAtivo] = useState('inicio')

    useEffect(() => {
        const intervalo = setInterval(() => {
            setDataHoraAtual(new Date());
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

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

    return (
        <div className="p-4 flex flex-col gap-4 row-span-2">
            <div className="flex items-center gap-6">
                <div className="flex items-center my-auto gap-2 text-verde-escuro">
                    <HiMiniUsers className="text-4xl" />
                    <h3 className="text-3xl font-bold">Painel do {usuario.role}</h3>
                </div>
                <div className="rounded-lg border shadow-[0px_0px_2px_1px_var(--verde-escuro)] flex items-center gap-2 p-2 ml-auto">
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
            <div className="relative flex items-center gap-2 p-4 rounded-lg shadow-[0px_0px_2px_1px_var(--verde-escuro)] overflow-hidden">
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
                    <h4 className="text-2xl">Bem Vindo (a), <b className="text-verde">{usuario.name}</b></h4>
                    <span>Gerencie todos os recursos do sistema de saúde.</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6 3xl:grid-cols-3">
                <div className="flex flex-col bg-white rounded-xl shadow-[0px_0px_2px_1px_var(--verde-escuro)] overflow-hidden">

                    {/* Cabeçalho */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">

                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-verde/10 text-verde flex items-center justify-center text-xl">
                                <LuNotebookPen />
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-zinc-800">
                                    Notas e Lembretes
                                </h3>

                                <p className="text-xs text-zinc-500">
                                    Informações importantes e lembretes
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="
                    flex items-center gap-2
                    px-3 py-2
                    rounded-lg
                    border border-verde/30
                    text-verde
                    text-sm font-semibold
                    hover:bg-verde
                    hover:text-white
                    transition-all duration-200
                "
                        >
                            <FaPlus />
                            Nova Nota
                        </button>

                    </div>


                    {/* Lista de notas */}
                    <div className="px-5 py-4">
                        <ul className="flex flex-col divide-y divide-zinc-100">
                            <li className="flex gap-3 py-2">

                                <div className="
                        shrink-0
                        w-10 h-10
                        rounded-lg
                        bg-verde/10
                        text-verde
                        flex items-center justify-center
                    ">
                                    <FaMapPin />
                                </div>

                                <div className="flex-1 min-w-0">

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="min-w-0">
                                            <h4 className="font-bold text-zinc-800 truncate">
                                                Outra anotação importante
                                            </h4>

                                            <p className="
                                    text-sm
                                    text-zinc-500
                                    mt-1
                                    line-clamp-2
                                    leading-5
                                ">
                                                Descrição da anotação ou lembrete
                                                relacionado ao atendimento.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="
                                    shrink-0
                                    p-1.5
                                    rounded-md
                                    text-zinc-400
                                    hover:text-zinc-700
                                    hover:bg-zinc-100
                                    transition
                                "
                                        >
                                            <CiMenuKebab className="text-xl" />
                                        </button>

                                    </div>

                                    <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
                                        <HiOutlineCalendarDateRange />
                                        <span>01/09/2026 às 09:00</span>
                                    </div>

                                </div>

                            </li>
                            <li className="flex gap-3 py-2">

                                <div className="
                        shrink-0
                        w-10 h-10
                        rounded-lg
                        bg-verde/10
                        text-verde
                        flex items-center justify-center
                    ">
                                    <FaMapPin />
                                </div>

                                <div className="flex-1 min-w-0">

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="min-w-0">
                                            <h4 className="font-bold text-zinc-800 truncate">
                                                Outra anotação importante
                                            </h4>

                                            <p className="
                                    text-sm
                                    text-zinc-500
                                    mt-1
                                    line-clamp-2
                                    leading-5
                                ">
                                                Descrição da anotação ou lembrete
                                                relacionado ao atendimento.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="
                                    shrink-0
                                    p-1.5
                                    rounded-md
                                    text-zinc-400
                                    hover:text-zinc-700
                                    hover:bg-zinc-100
                                    transition
                                "
                                        >
                                            <CiMenuKebab className="text-xl" />
                                        </button>

                                    </div>

                                    <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
                                        <HiOutlineCalendarDateRange />
                                        <span>01/09/2026 às 09:00</span>
                                    </div>

                                </div>

                            </li>
                            <li className="flex gap-3 py-2">

                                <div className="
                        shrink-0
                        w-10 h-10
                        rounded-lg
                        bg-verde/10
                        text-verde
                        flex items-center justify-center
                    ">
                                    <FaMapPin />
                                </div>

                                <div className="flex-1 min-w-0">

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="min-w-0">
                                            <h4 className="font-bold text-zinc-800 truncate">
                                                Lembrete de atendimento
                                            </h4>

                                            <p className="
                                    text-sm
                                    text-zinc-500
                                    mt-1
                                    line-clamp-2
                                    leading-5
                                ">
                                                Informações adicionais sobre o
                                                atendimento do paciente.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="
                                    shrink-0
                                    p-1.5
                                    rounded-md
                                    text-zinc-400
                                    hover:text-zinc-700
                                    hover:bg-zinc-100
                                    transition
                                "
                                        >
                                            <CiMenuKebab className="text-xl" />
                                        </button>

                                    </div>

                                    <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
                                        <HiOutlineCalendarDateRange />
                                        <span>01/09/2026 às 09:00</span>
                                    </div>

                                </div>

                            </li>
                        </ul>
                    </div>

                    {/* Rodapé */}
                    <div className="
                        mt-auto
                        flex items-center justify-between
                        px-5 py-3
                        border-t border-zinc-100
                        bg-zinc-50/50
                    ">
                        <span className="text-sm font-semibold text-verde-escuro">
                            3 notas cadastradas
                        </span>
                        <button
                            type="button"
                            className="
                                flex items-center gap-1
                                text-sm
                                font-bold
                                text-verde
                                hover:text-verde-escuro
                                transition
                            "
                        >
                            Ver todas
                            <IoIosArrowForward />
                        </button>

                    </div>

                </div>
                <div className="flex flex-col bg-white rounded-xl shadow-[0px_0px_2px_1px_var(--verde-escuro)] overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
                        <div className="
                            w-11 h-11
                            rounded-xl
                            bg-verde/10
                            text-verde
                            flex items-center justify-center
                            text-xl
                        ">
                            <LuNotebookPen />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-zinc-800">
                                Números Úteis - Ramais
                            </h3>
                            <p className="text-xs text-zinc-500">
                                Como realizar uma ligação interna
                            </p>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="
                            rounded-lg
                            bg-zinc-50
                            border border-zinc-100
                            p-4
                        ">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-3">
                                    <span className="
                                        shrink-0
                                        w-7 h-7
                                        rounded-full
                                        bg-verde
                                        text-white
                                        flex items-center justify-center
                                        text-sm font-bold my-auto
                                    ">
                                        1
                                    </span>
                                    <div>
                                        <p className="font-semibold text-zinc-800">
                                            Atenda a ligação
                                        </p>
                                        <p className="text-sm text-zinc-500 mt-0.5">
                                            Atenda normalmente a chamada recebida.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="
                                        shrink-0
                                        w-7 h-7
                                        rounded-full
                                        bg-verde
                                        text-white
                                        flex items-center justify-center
                                        text-sm font-bold
                                        my-2
                                    ">
                                        2
                                    </span>
                                    <div>
                                        <p className="font-semibold text-zinc-800">
                                            Pressione o ramal
                                        </p>
                                        <p className="text-sm text-zinc-500 mt-0.5">
                                            Digite o número no formato:
                                        </p>
                                        <span className="
                                            inline-block
                                            mt-2
                                            px-3 py-1
                                            rounded-md
                                            bg-white
                                            border border-zinc-200
                                            font-mono
                                            text-sm
                                            font-bold
                                            text-verde-escuro
                                        ">
                                            #Ramal#
                                        </span>
                                    </div>
                                </div>
                                <div className="
                                    flex items-start gap-3
                                    p-3
                                    rounded-lg
                                    bg-verde/5
                                    border border-verde/10
                                ">
                                    <span className="text-verde text-lg">
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-verde-escuro">
                                            Exemplo
                                        </p>
                                        <p className="text-sm text-zinc-600 mt-1">
                                            Para ligar para o Agendamento:
                                        </p>
                                        <span className="
                                            inline-block
                                            mt-1
                                            font-mono
                                            font-bold
                                            text-verde-escuro
                                        ">
                                            #1071#
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Rodapé */}
                    <div className="
                        mt-auto
                        px-5 py-3
                        border-t border-zinc-100
                        bg-zinc-50/50
                    ">
                        <p className="text-xs text-zinc-400">
                            Utilize os ramais para comunicação interna.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col bg-white rounded-xl shadow-[0px_0px_2px_1px_var(--verde-escuro)] overflow-hidden">
                    <div className="
                            flex items-center gap-3
                            px-5 py-4
                            border-b border-zinc-100
                        ">
                        <div className="
                            w-11 h-11
                            rounded-xl
                            bg-verde/10
                            text-verde
                            flex items-center justify-center
                            text-xl
                        ">
                            <FiLink />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-zinc-800">
                                Links Úteis
                            </h3>
                            <p className="text-xs text-zinc-500">
                                Acesse rapidamente os principais sistemas
                            </p>
                        </div>
                    </div>
                    <div className="p-5">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <li>
                                <Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group
                                        flex items-center gap-3
                                        p-3
                                        rounded-lg
                                        border border-zinc-100
                                        bg-zinc-50/50
                                        hover:border-verde/30
                                        hover:bg-verde/5
                                        transition-all duration-200
                                    "
                                >

                                    <div className="
                                        shrink-0
                                        w-10 h-10
                                        rounded-lg
                                        bg-blue-50
                                        text-blue-600
                                        flex items-center justify-center
                                        text-lg
                                    ">
                                        <FiGlobe />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="
                                            font-semibold
                                            text-sm
                                            text-zinc-800
                                            group-hover:text-verde-escuro
                                            line-clamp-1
                                        ">
                                            Sistema de Agendamento
                                        </h4>

                                        <p className="
                                            text-xs
                                            text-zinc-500
                                            mt-0.5
                                            truncate
                                        ">
                                            Acesse o sistema de agendamento
                                        </p>
                                    </div>

                                    <IoIosArrowForward className="
                                        shrink-0
                                        text-zinc-400
                                        group-hover:text-verde
                                        group-hover:translate-x-1
                                        transition-all
                                    " />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group
                                        flex items-center gap-3
                                        p-3
                                        rounded-lg
                                        border border-zinc-100
                                        bg-zinc-50/50
                                        hover:border-verde/30
                                        hover:bg-verde/5
                                        transition-all duration-200
                                    "
                                >

                                    <div className="
                                        shrink-0
                                        w-10 h-10
                                        rounded-lg
                                        bg-green-50
                                        text-green-600
                                        flex items-center justify-center
                                        text-lg
                                    ">
                                        <FiFileText />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="
                                            font-semibold
                                            text-sm
                                            text-zinc-800
                                            group-hover:text-verde-escuro
                                        ">
                                            Documentos
                                        </h4>

                                        <p className="
                                            text-xs
                                            text-zinc-500
                                            mt-0.5
                                            truncate
                                        ">
                                            Documentos e materiais importantes
                                        </p>
                                    </div>

                                    <IoIosArrowForward className="
                                        shrink-0
                                        text-zinc-400
                                        group-hover:text-verde
                                        group-hover:translate-x-1
                                        transition-all
                                    " />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group
                                        flex items-center gap-3
                                        p-3
                                        rounded-lg
                                        border border-zinc-100
                                        bg-zinc-50/50
                                        hover:border-verde/30
                                        hover:bg-verde/5
                                        transition-all duration-200
                                    "
                                >
                                    <div className="
                                        shrink-0
                                        w-10 h-10
                                        rounded-lg
                                        bg-orange-50
                                        text-orange-500
                                        flex items-center justify-center
                                        text-lg
                                    ">
                                        <FiBookOpen />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="
                                            font-semibold
                                            text-sm
                                            text-zinc-800
                                            group-hover:text-verde-escuro
                                        ">
                                            Manuais
                                        </h4>

                                        <p className="
                                            text-xs
                                            text-zinc-500
                                            mt-0.5
                                            truncate
                                        ">
                                            Manuais e instruções de utilização
                                        </p>
                                    </div>

                                    <IoIosArrowForward className="
                                    shrink-0
                                    text-zinc-400
                                    group-hover:text-verde
                                    group-hover:translate-x-1
                                    transition-all
                                " />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group
                                        flex items-center gap-3
                                        p-3
                                        rounded-lg
                                        border border-zinc-100
                                        bg-zinc-50/50
                                        hover:border-verde/30
                                        hover:bg-verde/5
                                        transition-all duration-200
                                    "
                                >
                                    <div className="
                                        shrink-0
                                        w-10 h-10
                                        rounded-lg
                                        bg-purple-50
                                        text-purple-600
                                        flex items-center justify-center
                                        text-lg
                                    ">
                                        <FiHelpCircle />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="
                                            font-semibold
                                            text-sm
                                            text-zinc-800
                                            group-hover:text-verde-escuro
                                        ">
                                            Suporte
                                        </h4>
                                        <p className="
                                            text-xs
                                            text-zinc-500
                                            mt-0.5
                                            truncate
                                        ">
                                            Acesse os canais de suporte
                                        </p>
                                    </div>
                                    <IoIosArrowForward className="
                                    shrink-0
                                    text-zinc-400
                                    group-hover:text-verde
                                    group-hover:translate-x-1
                                    transition-all
                                " />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group
                                        flex items-center gap-3
                                        p-3
                                        rounded-lg
                                        border border-zinc-100
                                        bg-zinc-50/50
                                        hover:border-verde/30
                                        hover:bg-verde/5
                                        transition-all duration-200
                                    "
                                >
                                    <div className="
                                        shrink-0
                                        w-10 h-10
                                        rounded-lg
                                        bg-orange-50
                                        text-orange-500
                                        flex items-center justify-center
                                        text-lg
                                    ">
                                        <FiBookOpen />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="
                                            font-semibold
                                            text-sm
                                            text-zinc-800
                                            group-hover:text-verde-escuro
                                        ">
                                            Manuais
                                        </h4>

                                        <p className="
                                            text-xs
                                            text-zinc-500
                                            mt-0.5
                                            truncate
                                        ">
                                            Manuais e instruções de utilização
                                        </p>
                                    </div>

                                    <IoIosArrowForward className="
                                    shrink-0
                                    text-zinc-400
                                    group-hover:text-verde
                                    group-hover:translate-x-1
                                    transition-all
                                " />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group
                                        flex items-center gap-3
                                        p-3
                                        rounded-lg
                                        border border-zinc-100
                                        bg-zinc-50/50
                                        hover:border-verde/30
                                        hover:bg-verde/5
                                        transition-all duration-200
                                    "
                                >
                                    <div className="
                                        shrink-0
                                        w-10 h-10
                                        rounded-lg
                                        bg-purple-50
                                        text-purple-600
                                        flex items-center justify-center
                                        text-lg
                                    ">
                                        <FiHelpCircle />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="
                                            font-semibold
                                            text-sm
                                            text-zinc-800
                                            group-hover:text-verde-escuro
                                        ">
                                            Suporte
                                        </h4>
                                        <p className="
                                            text-xs
                                            text-zinc-500
                                            mt-0.5
                                            truncate
                                        ">
                                            Acesse os canais de suporte
                                        </p>
                                    </div>
                                    <IoIosArrowForward className="
                                    shrink-0
                                    text-zinc-400
                                    group-hover:text-verde
                                    group-hover:translate-x-1
                                    transition-all
                                " />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group
                                        flex items-center gap-3
                                        p-3
                                        rounded-lg
                                        border border-zinc-100
                                        bg-zinc-50/50
                                        hover:border-verde/30
                                        hover:bg-verde/5
                                        transition-all duration-200
                                    "
                                >
                                    <div className="
                                        shrink-0
                                        w-10 h-10
                                        rounded-lg
                                        bg-orange-50
                                        text-orange-500
                                        flex items-center justify-center
                                        text-lg
                                    ">
                                        <FiBookOpen />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="
                                            font-semibold
                                            text-sm
                                            text-zinc-800
                                            group-hover:text-verde-escuro
                                        ">
                                            Manuais
                                        </h4>

                                        <p className="
                                            text-xs
                                            text-zinc-500
                                            mt-0.5
                                            truncate
                                        ">
                                            Manuais e instruções de utilização
                                        </p>
                                    </div>

                                    <IoIosArrowForward className="
                                    shrink-0
                                    text-zinc-400
                                    group-hover:text-verde
                                    group-hover:translate-x-1
                                    transition-all
                                " />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group
                                        flex items-center gap-3
                                        p-3
                                        rounded-lg
                                        border border-zinc-100
                                        bg-zinc-50/50
                                        hover:border-verde/30
                                        hover:bg-verde/5
                                        transition-all duration-200
                                    "
                                >
                                    <div className="
                                        shrink-0
                                        w-10 h-10
                                        rounded-lg
                                        bg-purple-50
                                        text-purple-600
                                        flex items-center justify-center
                                        text-lg
                                    ">
                                        <FiHelpCircle />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="
                                            font-semibold
                                            text-sm
                                            text-zinc-800
                                            group-hover:text-verde-escuro
                                        ">
                                            Suporte
                                        </h4>
                                        <p className="
                                            text-xs
                                            text-zinc-500
                                            mt-0.5
                                            truncate
                                        ">
                                            Acesse os canais de suporte
                                        </p>
                                    </div>
                                    <IoIosArrowForward className="
                                    shrink-0
                                    text-zinc-400
                                    group-hover:text-verde
                                    group-hover:translate-x-1
                                    transition-all
                                " />
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="
                        mt-auto
                        px-5 py-3
                        border-t border-zinc-100
                        bg-zinc-50/50
                    ">
                        <p className="text-xs text-zinc-400">
                            Clique em um link para abrir o recurso.
                        </p>
                    </div>

                </div>
                <div className="flex flex-col bg-white rounded-xl shadow-[0px_0px_2px_1px_var(--verde-escuro)] overflow-hidden col-span-3">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
                        <div className="
                            w-11 h-11
                            rounded-xl
                            bg-verde/10
                            text-verde
                            flex items-center justify-center
                            text-xl
                        ">
                            <LuNotebookPen />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-zinc-800">
                                Acesso Rápido
                            </h3>
                            <p className="text-xs text-zinc-500">
                                Atalhos, ações rápidas...
                            </p>
                        </div>
                    </div>
                    <div className="px-4">
                        <ul className="flex gap-4 py-2">
                            {menus.map((menu) =>
                                gerarBotaoMenu(
                                    menu.icone,
                                    menu.nome,
                                    menu.valor
                                )
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}