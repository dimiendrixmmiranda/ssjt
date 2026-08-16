interface InputTextAreaProps {
    label: string
    id: string
    nome: string
    valor: string
    icone: React.ReactNode
    altura: string
    placeholder: string
    setValor: (valor: string) => void
}

export default function InputTextArea({ label, id, nome, valor, icone, altura, placeholder, setValor }: InputTextAreaProps) {
    return (
        <div className="flex flex-col w-full 2xl:gap-1">
            <label htmlFor={id} className="2xl:text-lg">{label}</label>
            <div className="relative flex flex-col">
                <textarea
                    name={nome}
                    id={id}
                    value={valor}
                    placeholder={placeholder}
                    onChange={(e) => setValor(e.target.value)}
                    className={`${altura} shadow-[0px_0px_2px_1px_#999] p-1 rounded-lg pl-8 text-lg transition-all duration-200 focus:outline-verde`}
                >

                </textarea>
                <div className="absolute top-2 left-2 text-xl">
                    {icone}
                </div>
            </div>
        </div>
    )
}