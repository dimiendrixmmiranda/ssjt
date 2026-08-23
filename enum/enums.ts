export enum TipoDeDado {
    NOME = "NOME",
    DATA_DE_NASCIMENTO = "DATA_DE_NASCIMENTO",
    CPF = "CPF",
    CARTAO_SUS = "CARTAO_SUS",
    NOME_DA_MAE = "NOME_DA_MAE",
}
export enum Condicao {
    CONTEM = "CONTEM",
    MAIOR_QUE = "MAIOR_QUE",
    MENOR_QUE = "MENOR_QUE",
    IGUAL = "IGUAL",
}

export interface TipoDeDadoOption {
    valor: TipoDeDado;
    label: string;
}
export interface CondicaoOption {
    valor: Condicao;
    label: string;
}