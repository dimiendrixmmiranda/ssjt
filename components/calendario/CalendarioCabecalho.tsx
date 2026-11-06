"use client";

import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaArrowLeftLong, FaArrowRightLong, FaFilter } from "react-icons/fa6";

interface CalendarioCabecalhoProps {
    dataAtual: Date;
    proximoMes: () => void;
    mesAnterior: () => void;
    irParaHoje: () => void;
}

export default function CalendarioCabecalho({
    dataAtual,
    proximoMes,
    mesAnterior,
    irParaHoje,
}: CalendarioCabecalhoProps) {
    const dataValida = isValid(dataAtual) ? dataAtual : new Date();
    return (
        <div className="grid grid-cols-[auto_1fr] gap-4 border-b px-6 py-4 text-cinza">
            <div className="flex items-center gap-3">
                <button
                    onClick={mesAnterior}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer hover:bg-blue-600 hover:text-white"
                >
                    <FaArrowLeftLong />
                </button>

                <button
                    onClick={proximoMes}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer hover:bg-blue-600 hover:text-white"
                >
                    <FaArrowRightLong />
                </button>

                <button
                    onClick={irParaHoje}
                    className="rounded-lg border border-cinza px-4 py-2 text-sm font-medium cursor-pointer duration-300 transition-all hover:bg-blue-600 hover:text-white"
                >
                    Hoje
                </button>
            </div>

            <h2 className="text-xl font-bold capitalize flex items-center justify-center text-center">
                {format(dataValida, "MMMM, yyyy", {
                    locale: ptBR,
                })}
            </h2>
        </div>
    );
}