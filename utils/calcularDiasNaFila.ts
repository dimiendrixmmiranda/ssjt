export const calcularDiasNaFila = (dataDeEntrada: string | Date | null) => {
    if (!dataDeEntrada) return 0

    const entrada = new Date(dataDeEntrada)
    const hoje = new Date()

    // Ignora horas, minutos e segundos
    entrada.setHours(0, 0, 0, 0)
    hoje.setHours(0, 0, 0, 0)

    const diferenca = hoje.getTime() - entrada.getTime()

    return Math.max(0, Math.floor(diferenca / (1000 * 60 * 60 * 24)))
}