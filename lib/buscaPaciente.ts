export type TipoBuscaPaciente =
    | "NOME"
    | "CPF"
    | "DATA_NASCIMENTO"
    | "CARTAO_SUS"

export function removerCaracteresEspeciais(valor: string) {
    return valor.replace(/\D/g, "")
}

export function identificarTipoBuscaPaciente(
    valor: string
): TipoBuscaPaciente {
    const texto = valor.trim()
    const somenteNumeros = removerCaracteresEspeciais(texto)

    // CPF formatado ou não
    if (
        /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(texto)
    ) {
        return "CPF"
    }

    // Data: 01/01/2000 ou 01012000
    if (
        /^\d{2}\/\d{2}\/\d{4}$/.test(texto) ||
        /^\d{8}$/.test(texto)
    ) {
        return "DATA_NASCIMENTO"
    }

    // Cartão SUS
    if (
        /^\d{15}$/.test(somenteNumeros)
    ) {
        return "CARTAO_SUS"
    }

    // Se não foi identificado como número/data,
    // tratamos como nome.
    return "NOME"
}