"use client"
import { Prisma } from "@/app/generated/prisma/client"
import { useEffect, useState } from "react"

type EspecialidadeComFilhas = Prisma.EspecialidadeGetPayload<{
    include: {
        filhas: true
    }
}>

export function useEspecialidades() {
    const [especialidades, setEspecialidades] = useState<EspecialidadeComFilhas[]>([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    const buscarEspecialidades = async () => {
        try {
            setLoading(true)
            setErro(null)
            const resposta = await fetch("/api/especialidades")
            if (!resposta.ok) {
                throw new Error("Não foi possível buscar as especialidades.")
            }
            const dados: EspecialidadeComFilhas[] = await resposta.json()
            setEspecialidades(dados)
        } catch (error) {
            console.error("Erro ao buscar especialidades:", error)

            setErro("Erro ao carregar especialidades.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        buscarEspecialidades()
    }, [])
    
    return {
        especialidades,
        loading,
        erro,
        buscarEspecialidades,
    }
}