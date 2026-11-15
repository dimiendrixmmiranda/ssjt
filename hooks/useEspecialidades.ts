"use client"

import { Especialidade } from "@/generated/prisma/browser";
import { useEffect, useState } from "react";

export type EspecialidadeComCirurgias = Especialidade & {
    tiposDeCirurgia: {
        id: number;
        nome: string;
    }[];
};
export function useEspecialidades() {
    const [especialidades, setEspecialidades] = useState<EspecialidadeComCirurgias[]>([])
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

            const dados: EspecialidadeComCirurgias[] = await resposta.json()
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