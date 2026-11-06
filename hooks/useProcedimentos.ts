"use client"

import { useEffect, useState } from "react"
import type { Prisma } from "@/generated/prisma/client"

export type ProcedimentoComMembros = Prisma.ProcedimentoGetPayload<{
    include: {
        membros: true
    }
}>

export function useProcedimentos() {
    const [procedimentos, setProcedimentos] = useState<ProcedimentoComMembros[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    async function buscarProcedimentos() {
        try {
            setCarregando(true)
            setErro("")

            const resposta = await fetch("/api/criar-procedimento")

            if (!resposta.ok) {
                throw new Error("Não foi possível buscar os procedimentos.")
            }

            const dados: ProcedimentoComMembros[] = await resposta.json()

            setProcedimentos(dados)
        } catch (erro) {
            setErro(
                erro instanceof Error
                    ? erro.message
                    : "Erro ao buscar procedimentos."
            )
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        buscarProcedimentos()
    }, [])

    return {
        procedimentos,
        carregando,
        erro,
        buscarProcedimentos,
    }
}