type Setter<T> = React.Dispatch<React.SetStateAction<T>>

export function limparCampos(
    ...campos: [Setter<any>, any][]
) {
    campos.forEach(([setter, valorPadrao]) => {
        setter(valorPadrao)
    })
}