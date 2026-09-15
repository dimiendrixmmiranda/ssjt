import { useEspecialidades } from "@/hooks/useEspecialidades"

export const opcoesRede = [
    {
        valor: '',
        label: "Selecione"
    },
    {
        valor: 'REDE_MUNICIPAL',
        label: "Rede Municipal"
    },
    {
        valor: 'REDE_REFERENCIADA',
        label: "Rede Referencida"
    },

]

export const opcoesTipoDoLocal = [
    {
        valor: '',
        label: "Selecione"
    },
    {
        valor: 'POSTO_DE_SAUDE',
        label: "Posto de Saúde"
    },
    {
        valor: 'HOSPITAL',
        label: "Hospital"
    },
    {
        valor: 'CLINICA',
        label: "Clínica"
    },
]

export const opcoesDeSituacao = [
    {
        valor: '',
        label: 'Selecione'
    },
    {
        valor: 'ATIVO',
        label: 'Ativo'
    },
    {
        valor: 'INATIVO',
        label: 'Inativo'
    },

]

export const opcoesDeConvenio = [
    {
        label: 'Selecione',
        valor: ''
    },
    {
        label: 'Rede Municipal',
        valor: 'REDE_MUNICIPAL'
    },
    {
        label: 'Rede Referenciada',
        valor: 'REDE_REFERENCIADA'
    }
]

export const opcoesDeHorariosDeManha = [
    '07:30',
    '07:35',
    '07:40',
    '07:45',
    '07:50',
    '07:55',
    '08:00',
    '08:05',
    '08:10',
    '08:15',
    '08:20',
    '08:25',
    '08:30',
    '08:35',
    '08:40',
    '08:45',
    '08:50',
    '08:55',
    '09:00',
]

export const opcoesDeHorariosDeTarde = [
    '13:00',
    '13:05',
    '13:10',
    '13:15',
    '13:20',
    '13:25',
    '13:30',
    '13:35',
    '13:40',
    '13:45',
    '13:50',
    '13:55',
    '14:00',
    '14:05',
    '14:10',
    '14:15',
    '14:20',
    '14:25',
    '14:30',
]