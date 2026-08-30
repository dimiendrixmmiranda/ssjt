import { Condicao, CondicaoOption, TipoDeDado, TipoDeDadoOption } from "@/enum/enums";

export const tiposDeDados: TipoDeDadoOption[] = [
    {
        valor: TipoDeDado.NOME,
        label: "Nome",
    },
    {
        valor: TipoDeDado.CPF,
        label: "CPF",
    },
    {
        valor: TipoDeDado.CARTAO_SUS,
        label: "Cartão SUS",
    },
]


export const tiposDeCondicoes: CondicaoOption[] = [
    {
        valor: Condicao.CONTEM,
        label: "Contem",
    },
    {
        valor: Condicao.IGUAL,
        label: "Igual",
    },
    {
        valor: Condicao.MAIOR_QUE,
        label: "Maior Que",
    },
    {
        valor: Condicao.MENOR_QUE,
        label: "Menor Que",
    },
]
export const opcoesSexo = [
    { valor: "", label: "Selecione" },
    { valor: "MASCULINO", label: "Masculino" },
    { valor: "FEMININO", label: "Feminino" },
    { valor: "OUTRO", label: "Outro" },
    { valor: "NAO_INFORMADO", label: "Não informado" },
]
export const opcoesEstadoCivil = [
    { valor: "", label: "Selecione" },
    { valor: "SOLTEIRO", label: "Solteiro(a)" },
    { valor: "CASADO", label: "Casado(a)" },
    { valor: "DIVORCIADO", label: "Divorciado(a)" },
    { valor: "VIUVO", label: "Viúvo(a)" },
    { valor: "SEPARADO", label: "Separado(a)" },
    { valor: "UNIAO_ESTAVEL", label: "União estável" },
]
export const opcoesCorRaca = [
    { valor: "", label: "Selecione" },
    { valor: "BRANCA", label: "Branca" },
    { valor: "PRETA", label: "Preta" },
    { valor: "PARDA", label: "Parda" },
    { valor: "AMARELA", label: "Amarela" },
    { valor: "INDIGENA", label: "Indígena" },
    { valor: "NAO_INFORMADO", label: "Não informado" },
]
export const opcoesTipoSanguineo = [
    { valor: "", label: "Selecione" },
    { valor: "A", label: "A" },
    { valor: "B", label: "B" },
    { valor: "AB", label: "AB" },
    { valor: "O", label: "O" },
]
export const opcoesRh = [
    { valor: "", label: "Selecione" },
    { valor: "POSITIVO", label: "Positivo (+)" },
    { valor: "NEGATIVO", label: "Negativo (-)" },
]
export const opcoesSimNao = [
    { valor: "", label: "Selecione" },
    { valor: "SIM", label: "Sim" },
    { valor: "NAO", label: "Não" },
]
export const opcoesUf = [
    { valor: "", label: "Selecione" },
    { valor: "AC", label: "Acre - AC" },
    { valor: "AL", label: "Alagoas - AL" },
    { valor: "AP", label: "Amapá - AP" },
    { valor: "AM", label: "Amazonas - AM" },
    { valor: "BA", label: "Bahia - BA" },
    { valor: "CE", label: "Ceará - CE" },
    { valor: "DF", label: "Distrito Federal - DF" },
    { valor: "ES", label: "Espírito Santo - ES" },
    { valor: "GO", label: "Goiás - GO" },
    { valor: "MA", label: "Maranhão - MA" },
    { valor: "MT", label: "Mato Grosso - MT" },
    { valor: "MS", label: "Mato Grosso do Sul - MS" },
    { valor: "MG", label: "Minas Gerais - MG" },
    { valor: "PA", label: "Pará - PA" },
    { valor: "PB", label: "Paraíba - PB" },
    { valor: "PR", label: "Paraná - PR" },
    { valor: "PE", label: "Pernambuco - PE" },
    { valor: "PI", label: "Piauí - PI" },
    { valor: "RJ", label: "Rio de Janeiro - RJ" },
    { valor: "RN", label: "Rio Grande do Norte - RN" },
    { valor: "RS", label: "Rio Grande do Sul - RS" },
    { valor: "RO", label: "Rondônia - RO" },
    { valor: "RR", label: "Roraima - RR" },
    { valor: "SC", label: "Santa Catarina - SC" },
    { valor: "SP", label: "São Paulo - SP" },
    { valor: "SE", label: "Sergipe - SE" },
    { valor: "TO", label: "Tocantins - TO" },
]
export const opcoesGrauEscolaridade = [
    { valor: "", label: "Selecione" },
    { valor: "FUNDAMENTAL_INCOMPLETO", label: "Fundamental incompleto" },
    { valor: "FUNDAMENTAL_COMPLETO", label: "Fundamental completo" },
    { valor: "MEDIO_INCOMPLETO", label: "Médio incompleto" },
    { valor: "MEDIO_COMPLETO", label: "Médio completo" },
    { valor: "SUPERIOR_INCOMPLETO", label: "Superior incompleto" },
    { valor: "SUPERIOR_COMPLETO", label: "Superior completo" },
    { valor: "POS_GRADUACAO", label: "Pós-graduação" },
    { valor: "MESTRADO", label: "Mestrado" },
    { valor: "DOUTORADO", label: "Doutorado" },
]
export const opcoesOrgaoEmissor = [
    { valor: "", label: "Selecione" },
    { valor: "SSP", label: "SSP" },
    { valor: "DETRAN", label: "DETRAN" },
    { valor: "POLICIA_CIVIL", label: "Polícia Civil" },
    { valor: "OUTRO", label: "Outro" },

]