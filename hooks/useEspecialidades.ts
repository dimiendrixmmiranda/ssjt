"use client"

import { Especialidade } from "@/generated/prisma/browser";
import { useEffect, useState } from "react";

export function useEspecialidades() {
    const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    async function buscarEspecialidades() {
        try {
            setCarregando(true)
            setErro("")

            const resposta = await fetch("/api/criar-especialidade")

            if (!resposta.ok) {
                throw new Error("Não foi possível buscar os especialidades.")
            }

            const dados: Especialidade[] = await resposta.json()

            setEspecialidades(dados)
        } catch (erro) {
            setErro(
                erro instanceof Error
                    ? erro.message
                    : "Erro ao buscar especialidades."
            )
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        buscarEspecialidades()
    }, [])

    return {
        especialidades,
        carregando,
        erro,
        buscarEspecialidades,
    }
}