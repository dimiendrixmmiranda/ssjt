interface InputDataProps {
    label: string
    id: string
    nome: string
    valor: string
    icone: React.ReactNode
    placeholder: string
    disabled?: boolean
    setValor: (valor: string) => void
}

export default function InputData({ label, id, nome, valor, icone, placeholder, disabled, setValor }: InputDataProps) {
    return (
        <div className="flex flex-col w-full 2xl:gap-1">
            <label htmlFor={id} className="2xl:text-lg">{label}</label>
            <div className="relative flex flex-col">
                <input
                    type="date"
                    name={nome}
                    id={id}
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="shadow-[0px_0px_2px_1px_#999] p-1 rounded-lg pl-8 text-lg transition-all duration-200 focus:outline-verde"
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <div className="absolute top-[50%] left-1 text-xl" style={{transform: 'translate(0,-50%)'}}>
                    {icone}
                </div>
            </div>
        </div>
    )
}