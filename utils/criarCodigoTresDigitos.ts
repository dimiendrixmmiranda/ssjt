export function criarCodigoTresDigitos() {
        return Math.floor(Math.random() * 1000)
                .toString()
                .padStart(3, "0")
}