export function calcularIdade(dataNascimento: string | Date): string {
    const nascimento = dataNascimento instanceof Date
        ? new Date(dataNascimento)
        : new Date(dataNascimento);

    const hoje = new Date();

    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();
    let dias = hoje.getDate() - nascimento.getDate();

    if (dias < 0) {
        meses--;

        const ultimoDiaMesAnterior = new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            0
        ).getDate();

        dias += ultimoDiaMesAnterior;
    }

    if (meses < 0) {
        anos--;
        meses += 12;
    }

    const textoAnos = `${anos} ${anos === 1 ? "ano" : "anos"}`;
    const textoMeses = `${meses} ${meses === 1 ? "mês" : "meses"}`;
    const textoDias = `${dias} ${dias === 1 ? "dia" : "dias"}`;

    return `${textoAnos} ${textoMeses} e ${textoDias}`;
}