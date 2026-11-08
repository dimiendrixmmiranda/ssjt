"use client"

import { Paciente } from "@/generated/prisma/client"
import { useEffect, useState } from "react"

export function usePacientes() {
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    async function buscarPaciente() {
        try {
            setCarregando(true)
            setErro("")

            const resposta = await fetch("/api/criar-paciente")

            if (!resposta.ok) {
                throw new Error("Não foi possível buscar os pacientes.")
            }

            const dados: Paciente[] = await resposta.json()

            setPacientes(dados)

        } catch (erro) {
            setErro(
                erro instanceof Error
                    ? erro.message
                    : "Erro ao buscar pacientes."
            )
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        buscarPaciente()
    }, [])

    return {
        pacientes,
        carregando,
        erro,
        buscarPaciente,
    }
}