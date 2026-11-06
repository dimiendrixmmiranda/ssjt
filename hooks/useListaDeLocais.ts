"use client"

import { Local } from "@/generated/prisma/client";
import { useEffect, useState } from "react";

export function useLocais() {
    const [locais, setLocais] = useState<Local[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    async function buscarLocais() {
        try {
            setCarregando(true)
            setErro("")

            const resposta = await fetch("/api/criar-local")

            if (!resposta.ok) {
                throw new Error("Não foi possível buscar os locais.")
            }

            const dados: Local[] = await resposta.json()

            setLocais(dados)
        } catch (erro) {
            setErro(
                erro instanceof Error
                    ? erro.message
                    : "Erro ao buscar locais."
            )
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        buscarLocais()
    }, [])

    return {
        locais,
        carregando,
        erro,
        buscarLocais,
    }
}