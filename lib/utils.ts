import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function gerarCodigoTresDigitos() {
  const gerarNumeros = Math.floor(Math.random() * 900) + 100;

  return gerarNumeros.toString();
}

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

export function limparCampos(
  ...campos: [Setter<any>, any][]
) {
  campos.forEach(([setter, valorPadrao]) => {
    setter(valorPadrao)
  })
}

export const copiarTexto = async (texto: unknown) => {
  try {
    await navigator.clipboard.writeText(String(texto))
    console.log("Texto copiado!")
  } catch (erro) {
    console.error("Erro ao copiar:", erro)
  }
}