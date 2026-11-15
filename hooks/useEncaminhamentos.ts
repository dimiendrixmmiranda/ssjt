
'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Prisma } from '@/generated/prisma/client'

export type EncaminhamentoComRelacoes =
    Prisma.EncaminhamentoGetPayload<{
        include: {
            paciente: true
            unidadeDeOrigem: true
            medicoSolicitante: true
            especialidadeDoPrestador: true
            especialidadeEncaminhada: true
            procedimento: true
            membroProcedimento: true
            prestadorExecutante: true
        }
    }>

export function useEncaminhamentos() {
    const [encaminhamentos, setEncaminhamentos] =
        useState<EncaminhamentoComRelacoes[]>([])

    const [carregandoEncaminhamentos, setCarregandoEncaminhamentos] =
        useState(true)

    const buscarEncaminhamentos = useCallback(async () => {
        try {
            setCarregandoEncaminhamentos(true)

            const resposta = await fetch('/api/criar-encaminhamento')
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

    useEffect(() => {
        buscarEncaminhamentos()
    }, [buscarEncaminhamentos])

    return {
        encaminhamentos,
        carregandoEncaminhamentos,
        buscarEncaminhamentos
    }
}
