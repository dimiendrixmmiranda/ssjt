"use client"

import { Prisma } from "@/generated/prisma/client"
import { useEffect, useState } from "react"

export type PrestadorComRelacoes = Prisma.PrestadorGetPayload<{
    include: {
        especialidades: {
            include: {
                especialidade: true
            }
        }
        procedimentos: {
            include: {
                procedimento: true
            }
        }
    }
}>

export function usePrestadores() {
    const [prestadores, setPrestadores] = useState<PrestadorComRelacoes[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    async function buscarPrestadores() {
        try {
            setCarregando(true)
            setErro("")

            const resposta = await fetch("/api/criar-prestador")

            if (!resposta.ok) {
                throw new Error("Não foi possível buscar os prestadores.")
            }

            const dados: PrestadorComRelacoes[] = await resposta.json()

            setPrestadores(dados)

        } catch (erro) {
            setErro(
                erro instanceof Error
                    ? erro.message
                    : "Erro ao buscar prestadores."
            )
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        buscarPrestadores()
    }, [])

    return {
        prestadores,
        carregando,
        erro,
        buscarPrestadores,
    }
}