"use client"

import { Usuario } from "@/app/generated/prisma/client"
import { useEffect, useState } from "react"

type UsuarioComLocal = Usuario & {
    unidadeDeOrigem?: {
        id: number
        nome: string
        cidade: string
        uf: string
    } | null
}

export function useUsuarios() {
    const [usuarios, setUsuarios] = useState<UsuarioComLocal[]>([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    const buscarUsuarios = async () => {
        try {
            setLoading(true)
            setErro(null)

            const resposta = await fetch("/api/usuario")

            if (!resposta.ok) {
                throw new Error("Não foi possível buscar os usuários")
            }

            const dados: UsuarioComLocal[] = await resposta.json()

            setUsuarios(dados)
        } catch (error) {
            console.error("Erro ao buscar usuários:", error)
            setErro("Erro ao carregar usuários")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        buscarUsuarios()
    }, [])

    return {
        usuarios,
        loading,
        erro,
        buscarUsuarios,
    }
}