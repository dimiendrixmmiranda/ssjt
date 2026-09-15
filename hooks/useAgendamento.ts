"use client"

import { useCallback, useEffect, useState } from "react"
import {
    Agendamento,
    Paciente,
    Local,
    Medico,
    Especialidade,
    EspecialidadeFilha,
    Procedimento,
    ProcedimentoFilho,
} from "@/app/generated/prisma/client"

type AgendamentoComRelacoes = Agendamento & {
    paciente: Paciente
    unidadeDeOrigem: Local
    medicoSolicitante: Medico | null
    especialidade: Especialidade | null
    especialidadeFilha: EspecialidadeFilha | null
    procedimento: Procedimento | null
    procedimentoFilho: ProcedimentoFilho | null
}

export function useAgendamentos() {
    const [agendamentos, setAgendamentos] = useState<AgendamentoComRelacoes[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    const buscarAgendamentos = useCallback(async () => {
        try {
            setCarregando(true)
            setErro(null)

            const resposta = await fetch("/api/agendamento")

            if (!resposta.ok) {
                throw new Error("Erro ao buscar agendamentos.")
            }

            const dados: AgendamentoComRelacoes[] = await resposta.json()

            setAgendamentos(dados)
        } catch (erro) {
            console.error("Erro ao buscar agendamentos:", erro)

            setErro("Erro ao buscar agendamentos.")
        } finally {
            setCarregando(false)
        }
    }, [])

    useEffect(() => {
        buscarAgendamentos()
    }, [buscarAgendamentos])

    return {
        agendamentos,
        carregando,
        erro,
        buscarAgendamentos,
    }
}