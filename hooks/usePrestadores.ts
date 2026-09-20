import { Prestador } from "@/app/generated/prisma/client"
import { useEffect, useState } from "react"
export function usePrestadores() {
    const [prestadores, setPrestadores] = useState<Prestador[]>([])
    const [carregando, setCarregando] = useState(true)

    const buscarPrestadores = async () => {
        try {
            setCarregando(true)

            const resposta = await fetch("/api/prestador")

            if (!resposta.ok) {
                throw new Error("Erro ao buscar prestadores")
            }

            const dados = await resposta.json()

            setPrestadores(dados)
        } catch (error) {
            console.error("Erro ao buscar prestadores:", error)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        buscarPrestadores()
    }, [])

    return {
        prestadores,
        carregando,
        buscarPrestadores,
    }
}