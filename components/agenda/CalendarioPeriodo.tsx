
"use client"

import { useEffect, useState } from "react"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"

interface CalendarioPeriodoProps {
    dataDeInicio: string
    dataDeFim: string
    setDataDeInicio: (data: string) => void
    setDataDeFim: (data: string) => void
}

const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

function converterData(data: string) {
    if (!data) return null

    const [ano, mes, dia] = data.split("-").map(Number)

    return new Date(ano, mes - 1, dia)
}

function formatarData(data: Date) {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const dia = String(data.getDate()).padStart(2, "0")

    return `${ano}-${mes}-${dia}`
}

export function CalendarioPeriodo({
    dataDeInicio,
    dataDeFim,
    setDataDeInicio,
    setDataDeFim,
}: CalendarioPeriodoProps) {
    const [mesAtual, setMesAtual] = useState(() => {
        return converterData(dataDeInicio) ?? new Date()
    })

    useEffect(() => {
        if (dataDeInicio) {
            const data = converterData(dataDeInicio)

            if (data) {
                setMesAtual(data)
            }
        }
    }, [dataDeInicio])

    const ano = mesAtual.getFullYear()
    const mes = mesAtual.getMonth()

    const primeiroDia = new Date(ano, mes, 1)
    const quantidadeDeDias = new Date(ano, mes + 1, 0).getDate()

    // Ajusta a semana para começar na segunda-feira.
    const diaInicial = (primeiroDia.getDay() + 6) % 7

    const dias = [
        ...Array(diaInicial).fill(null),
        ...Array.from({ length: quantidadeDeDias }, (_, i) => i + 1),
    ]

    // Completa o calendário para manter seis semanas.
    while (dias.length < 42) {
        dias.push(null)
    }

    const inicio = converterData(dataDeInicio)
    const fim = converterData(dataDeFim)

    function selecionarDia(dia: number) {
        const dataSelecionada = formatarData(new Date(ano, mes, dia))

        if (!dataDeInicio || dataDeFim) {
            setDataDeInicio(dataSelecionada)
            setDataDeFim("")
            return
        }

        if (dataSelecionada < dataDeInicio) {
            setDataDeInicio(dataSelecionada)
            setDataDeFim("")
            return
        }

        setDataDeFim(dataSelecionada)
    }

    function estaNoIntervalo(dia: number) {
        if (!inicio || !fim) return false

        const data = new Date(ano, mes, dia)

        return data > inicio && data < fim
    }

    function estaSelecionado(dia: number) {
        const data = formatarData(new Date(ano, mes, dia))

        return data === dataDeInicio || data === dataDeFim
    }

    const nomeDoMes = mesAtual.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    })

    return (
        <div className="w-full rounded-lg border border-[#087A42] p-4">
            {/* Navegação do mês */}
            <div className="flex items-center justify-between mb-5">
                <button
                    type="button"
                    onClick={() =>
                        setMesAtual(new Date(ano, mes - 1, 1))
                    }
                    className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-green-50 text-[#006B38] transition"
                    aria-label="Mês anterior"
                >
                    <BsChevronLeft />
                </button>

                <h3 className="font-semibold text-[#005C32] capitalize">
                    {nomeDoMes}
                </h3>

                <button
                    type="button"
                    onClick={() =>
                        setMesAtual(new Date(ano, mes + 1, 1))
                    }
                    className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-green-50 text-[#006B38] transition"
                    aria-label="Próximo mês"
                >
                    <BsChevronRight />
                </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 mb-2">
                {diasDaSemana.map((dia) => (
                    <div
                        key={dia}
                        className="text-center text-xs font-semibold text-gray-500 py-2"
                    >
                        {dia}
                    </div>
                ))}
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7 gap-y-1">
                {dias.map((dia, indice) => {
                    if (!dia) {
                        return <div key={`vazio-${indice}`} />
                    }

                    const selecionado = estaSelecionado(dia)
                    const intervalo = estaNoIntervalo(dia)

                    const hoje = formatarData(new Date()) ===
                        formatarData(new Date(ano, mes, dia))

                    return (
                        <button
                            key={dia}
                            type="button"
                            onClick={() => selecionarDia(dia)}
                            className={`
                                h-9 w-9 mx-auto rounded-full text-sm
                                flex items-center justify-center
                                transition-colors
                                ${selecionado
                                    ? "bg-[#006B38] text-white font-bold"
                                    : intervalo
                                        ? "bg-[#D1FAE5] text-[#005C32] rounded-lg"
                                        : "text-gray-700 hover:bg-green-100"
                                }
                                ${hoje && !selecionado
                                    ? "ring-1 ring-[#087A42] font-bold"
                                    : ""
                                }
                            `}
                        >
                            {dia}
                        </button>
                    )
                })}
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap items-center gap-4 mt-5 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#006B38]" />
                    <span className="text-xs text-gray-600">Início e fim</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-[#D1FAE5]" />
                    <span className="text-xs text-gray-600">Período selecionado</span>
                </div>
            </div>
        </div>
    )
}
