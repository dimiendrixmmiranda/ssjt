export default function calcularIdade(dataNascimento: string | Date | null | undefined) {
    if (!dataNascimento) return "-"

    const dataString =
        typeof dataNascimento === "string"
            ? dataNascimento.split("T")[0]
            : dataNascimento.toISOString().split("T")[0]

    const [ano, mes, dia] = dataString.split("-").map(Number)

    const nascimento = new Date(ano, mes - 1, dia)
    const hoje = new Date()

    hoje.setHours(0, 0, 0, 0)

    let anos = hoje.getFullYear() - nascimento.getFullYear()
    let meses = hoje.getMonth() - nascimento.getMonth()
    let dias = hoje.getDate() - nascimento.getDate()

    if (dias < 0) {
        meses--

        const ultimoDiaMesAnterior = new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            0
        ).getDate()

        dias += ultimoDiaMesAnterior
    }

    if (meses < 0) {
        anos--
        meses += 12
    }

    return `${anos} anos ${meses} meses e ${dias} dias`
}