
'use client'

import { useCallback, useState } from 'react'
import type { Prisma } from '@/generated/prisma/client'

export type EncaminhamentoComRelacoes =
    Prisma.EncaminhamentoGetPayload<{
        include: {
            paciente: true
            unidadeDeOrigem: true
            medicoSolicitante: true
            especialidadeDoPrestador: true
            especialidadeEncaminhada: true
            procedimento: {
                include: {
                    membros: true
                }
            }
            membroProcedimento: true
            prestadorExecutante: true
        }
    }>

export function useEncaminhamentos() {
    const [encaminhamentos, setEncaminhamentos] =
        useState<EncaminhamentoComRelacoes[]>([])

    const [carregandoEncaminhamentos, setCarregandoEncaminhamentos] =
        useState(false)

    const buscarEncaminhamentos = useCallback(async (
        filtros?: Record<string, string>
    ) => {
        try {
            setCarregandoEncaminhamentos(true)

            const parametros = new URLSearchParams(filtros)

            const resposta = await fetch(
                `/api/criar-encaminhamento?${parametros.toString()}`
            )

            const resultado = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro || 'Erro ao buscar encaminhamentos.'
                )
            }

            setEncaminhamentos(
                Array.isArray(resultado)
                    ? resultado
                    : resultado.encaminhamentos ?? []
            )
        } catch (erro) {
            console.error('Erro ao buscar encaminhamentos:', erro)
        } finally {
            setCarregandoEncaminhamentos(false)
        }
    }, [])

    return {
        encaminhamentos,
        carregandoEncaminhamentos,
        buscarEncaminhamentos
    }
}
