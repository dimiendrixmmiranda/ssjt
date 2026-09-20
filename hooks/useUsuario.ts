"use client"
import { UsuarioLogado } from "@/types/usuario"
import { useEffect, useState } from "react"

export function useUsuario() {
    const [usuario, setUsuario] = useState<UsuarioLogado | null>(null)
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        const buscarUsuario = async () => {
            try {
                const resposta = await fetch("/api/usuario/me")

                if (!resposta.ok) {
                    throw new Error("Não foi possível buscar o usuário")
                }

                const dados: UsuarioLogado = await resposta.json()

                setUsuario(dados)
            } catch (error) {
                console.error(error)
                setErro("Erro ao carregar usuário")
            } finally {
                setLoading(false)
            }
        }

        buscarUsuario()
    }, [])

    return {
        usuario,
        loading,
        erro,
    }
}