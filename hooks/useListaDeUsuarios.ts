"use client"

import { Usuario } from "@/generated/prisma/browser";
import { Local } from "@/generated/prisma/client";
import { useEffect, useState } from "react";

export function useUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    async function buscarUsuarios() {
        try {
            setCarregando(true)
            setErro("")

            const resposta = await fetch("/api/criar-usuario")

            if (!resposta.ok) {
                throw new Error("Não foi possível buscar os usuarios.")
            }

            const dados: Usuario[] = await resposta.json()

            setUsuarios(dados)
        } catch (erro) {
            setErro(
                erro instanceof Error
                    ? erro.message
                    : "Erro ao buscar usuarios."
            )
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        buscarUsuarios()
    }, [])

    return {
        usuarios,
        carregando,
        erro,
        buscarUsuarios,
    }
}