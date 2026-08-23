import { Local } from "@/app/generated/prisma/client"
import { useCallback, useEffect, useState } from "react"

export function useLocais() {
    const [locais, setLocais] = useState<Local[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const buscarLocais = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch("/api/locais")

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.erro ||
                    data.error ||
                    "Erro ao buscar locais."
                )
            }

            setLocais(data)

        } catch (error) {
            console.error(
                "Erro ao buscar locais:",
                error
            )

            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao buscar locais."
            )

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        buscarLocais()
    }, [buscarLocais])

    return {
        locais,
        loading,
        error,
        buscarLocais
    }
}