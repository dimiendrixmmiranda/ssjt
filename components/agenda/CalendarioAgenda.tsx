'use client'

import { useMemo, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

interface CalendarioAgendaProps {
    dataSelecionada: string
    onChange: (data: string) => void
    datasComAgendamento?: string[]
}

const diasSemana = [
    "Dom",
    "Seg",
    "Ter",
    "Qua",
    "Qui",
    "Sex",
    "Sáb"
]

const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
]

function formatarData(date: Date) {
    const ano = date.getFullYear()
    const mes = String(date.getMonth() + 1).padStart(2, "0")
    const dia = String(date.getDate()).padStart(2, "0")

    return `${ano}-${mes}-${dia}`
}

function criarDataSegura(data: string) {
    const [ano, mes, dia] = data.split("-").map(Number)

    return new Date(ano, mes - 1, dia)
}

export default function CalendarioAgenda({
    dataSelecionada,
    datasComAgendamento,
    onChange
}: CalendarioAgendaProps) {

    const hoje = new Date()

    const [mesAtual, setMesAtual] = useState(
        dataSelecionada
            ? criarDataSegura(dataSelecionada)
            : hoje
    )

    const diasDoMes = useMemo(() => {

        const ano = mesAtual.getFullYear()
        const mes = mesAtual.getMonth()

        const primeiroDia = new Date(ano, mes, 1)
        const ultimoDia = new Date(ano, mes + 1, 0)

        const quantidadeDias = ultimoDia.getDate()

        const primeiroDiaSemana = primeiroDia.getDay()

        const dias = []

        // Espaços antes do primeiro dia
        for (let i = 0; i < primeiroDiaSemana; i++) {
            dias.push(null)
        }

        // Dias do mês
        for (let dia = 1; dia <= quantidadeDias; dia++) {
            dias.push(
                new Date(ano, mes, dia)
            )
        }

        return dias

    }, [mesAtual])

    function mesAnterior() {
        setMesAtual(
            new Date(
                mesAtual.getFullYear(),
                mesAtual.getMonth() - 1,
                1
            )
        )
    }

    function proximoMes() {
        setMesAtual(
            new Date(
                mesAtual.getFullYear(),
                mesAtual.getMonth() + 1,
                1
            )
        )
    }

    function selecionarDia(data: Date) {

        const dataFormatada = formatarData(data)

        onChange(dataFormatada)
    }

    function voltarParaHoje() {
        const hoje = new Date()

        setMesAtual(hoje)
        onChange(formatarData(hoje))
    }



    return (
        <div className="w-full">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={mesAnterior}
                    className="
                        w-8 h-8
                        flex items-center justify-center
                        rounded-md
                        hover:bg-gray-100
                        text-gray-600
                        transition
                    "
                >
                    <FaChevronLeft size={12} />
                </button>
                <div className="text-center flex items-center gap-4">
                    <h3 className="font-semibold text-gray-800">
                        {meses[mesAtual.getMonth()]}
                    </h3>
                    <span className="text-sm text-gray-500">
                        {mesAtual.getFullYear()}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={proximoMes}
                    className="
                        w-8 h-8
                        flex items-center justify-center
                        rounded-md
                        hover:bg-gray-100
                        text-gray-600
                        transition
                    "
                >
                    <FaChevronRight size={12} />
                </button>
            </div>
            {/* Dias da semana */}
            <div className="grid grid-cols-7 mb-2">
                {diasSemana.map((dia, index) => (
                    <div
                        key={dia}
                        className={`
                            text-center
                            text-xs
                            font-medium
                            py-2
                            ${index === 0 || index === 6
                                ? "text-red-500"
                                : "text-gray-500"
                            }
                        `}
                    >
                        {dia}
                    </div>

                ))}

            </div>

            {/* Dias */}
            <div className="grid grid-cols-7 gap-1">
                {diasDoMes.map((data, index) => {
                    if (!data) {
                        return (
                            <div
                                key={`vazio-${index}`}
                                className="h-9"
                            />
                        )
                    }

                    const dataFormatada = formatarData(data)

                    const selecionado =
                        dataFormatada === dataSelecionada

                    const hojeFormatado =
                        formatarData(hoje) === dataFormatada

                    const temAgendamento =
                        datasComAgendamento?.includes(dataFormatada)

                    return (
                        <button
                            key={dataFormatada}
                            type="button"
                            onClick={() => selecionarDia(data)}
                            className={`
                                h-9
                                rounded-md
                                text-sm
                                transition
                                flex
                                items-center
                                justify-center

                                ${selecionado
                                    ? "bg-green-600 text-white font-semibold"
                                    : hojeFormatado
                                        ? "border border-green-600 text-green-700 font-semibold"
                                        : "text-gray-700 hover:bg-green-50"
                                }
                            `}
                        >
                            <div className="relative flex items-center justify-center w-full h-full">
                                {data.getDate()}

                                {temAgendamento && (
                                    <span
                                        className={`
                                            absolute
                                            bottom-0.5
                                            w-1.5
                                            h-1.5
                                            rounded-full
                                            ${selecionado ? "bg-white" : "bg-green-600"}
                                        `}
                                    />
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>
            {/* Rodapé */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-green-600" />
                    Dia selecionado
                </div>
                <button
                    type="button"
                    onClick={voltarParaHoje}
                    className="
                        text-xs
                        text-green-700
                        hover:text-green-800
                        font-medium
                    "
                >
                    Hoje
                </button>
            </div>
        </div>
    )
}