"use client"

import { Paciente } from "@/app/generated/prisma/client"
import { useCallback, useEffect, useState } from "react"


export function usePacientes() {

    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const buscarPacientes = useCallback(async () => {
        try {

            setLoading(true)
            setError(null)

            const response = await fetch("/api/pacientes")

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.erro ||
                    data.error ||
                    "Erro ao buscar pacientes."
                )
            }

            setPacientes(data)

        } catch (error) {

            console.error(
                "Erro ao buscar pacientes:",
                error
            )

            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao buscar pacientes."
            )

        } finally {

            setLoading(false)

        }

    }, [])

    useEffect(() => {
        buscarPacientes()
    }, [buscarPacientes])

    return {
        pacientes,
        loading,
        error,
        buscarPacientes,
    }
}