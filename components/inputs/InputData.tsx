interface InputDataProps {
    label: string
    id: string
    nome: string
    valor: string
    icone: React.ReactNode
    placeholder: string
    disabled?: boolean
    campoObrigatorio?: boolean
    estiloPersonalizado?: string
    setValor: (valor: string) => void
}

export default function InputData({ label, id, nome, valor, icone, placeholder, disabled, campoObrigatorio, estiloPersonalizado, setValor }: InputDataProps) {
    return (
        <div className={`flex flex-col w-full ${estiloPersonalizado}`}>
            <div className="flex items-center gap-2">
                <label htmlFor={id} className="2xl:text-lg">{label}</label>
                {
                    campoObrigatorio && (<p className="font-bold text-2xl leading-3 text-red-600 mt-2">*</p>)
                }
            </div>
            <div className="relative flex flex-col">
                <input
                    type="date"
                    name={nome}
                    id={id}
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] p-1 rounded-lg pl-8 text-lg transition-all duration-200 focus:outline-verde h-[40px]"
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <div className="absolute top-[50%] left-1 text-xl" style={{ transform: 'translate(0,-50%)' }}>
                    {icone}
                </div>
            </div>
        </div>
    )
}