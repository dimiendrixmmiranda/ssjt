'use client'
import { Local } from "@/generated/prisma/browser"
import { AtendimentoDentroOuForaDoMunicipio, TipoDeConta, TipoDeLocal } from "@/generated/prisma/enums"
export const opcoesDeTipoDeLocal = [
    {
        valor: '',
        label: "Selecione"
    },
    ...Object.values(TipoDeLocal).map(tipo => ({
        valor: tipo,
        label: tipo.replaceAll('_', ' ').toLowerCase()
    }))
]

export const opcoesDeAtendimentoDentroOuForaDoMunicipio = [
    {
        valor: '',
        label: "Selecione"
    },
    ...Object.values(AtendimentoDentroOuForaDoMunicipio).map(tipo => ({
        valor: tipo,
        label: tipo.replaceAll('_', ' ').toLowerCase()
    }))
]

export const opcoesDeLocais = (locais: Local[]) => {
    return [
        {
            valor: null,
            label: "Selecione"
        },
        ...locais.map(local => ({
            valor: local.id,
            label: local.nome
        }))
    ];
};

export const opcoesDeTipoDeConta= [
    {
        valor: '',
        label: "Selecione"
    },
    ...Object.values(TipoDeConta).map(tipo => ({
        valor: tipo,
        label: tipo.replaceAll('_', ' ').toLowerCase()
    }))
]

export const CORES_PRESTADORES = [
    "#2563EB", // Azul
    "#DC2626", // Vermelho
    "#16A34A", // Verde
    "#9333EA", // Roxo
    "#EA580C", // Laranja
    "#0891B2", // Ciano
    "#DB2777", // Rosa
    "#CA8A04", // Amarelo escuro
    "#4F46E5", // Índigo
    "#0D9488", // Turquesa
    "#BE123C", // Cereja
    "#65A30D", // Lima
    "#7C3AED", // Violeta
    "#C2410C", // Laranja escuro
    "#0369A1", // Azul oceano
    "#A21CAF", // Magenta
    "#15803D", // Verde escuro
    "#B45309", // Âmbar
    "#475569", // Cinza azulado
    "#0F766E", // Verde petróleo
    "#6D28D9", // Púrpura
    "#E11D48", // Rosa avermelhado
    "#4D7C0F", // Verde oliva
    "#1D4ED8", // Azul royal
]