import { TipoAtendimento } from "@/app/generated/prisma/client";
import { useEffect, useState } from "react";

export function useEspecialidades() {
    const [especialidades, setEspecialidades] = useState<TipoAtendimento[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const buscarEspecialidades = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch("/api/especialidades")
            if (!response.ok) {
                throw new Error("Erro ao buscar especialidades.")
            }
            const data = await response.json()
            setEspecialidades(data)
        } catch (err) {
            console.error("Erro ao buscar especialidades:", err)
            setError(
                err instanceof Error
                    ? err.message
                    : "Erro ao buscar especialidades."
            )
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
        error,
        buscarEspecialidades,
    }
}