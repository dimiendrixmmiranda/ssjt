interface InputCheckboxProps {
    label: string
    id: string
    nome: string
    valor: boolean
    setValor: (valor: boolean) => void
    descricao?: string
}

export default function InputCheckbox({
    label,
    id,
    nome,
    valor,
    setValor,
    descricao,
}: InputCheckboxProps) {
    return (
        <div className="flex items-start gap-2 w-full">
            <input
                type="checkbox"
                name={nome}
                id={id}
                checked={valor}
                onChange={(e) => setValor(e.target.checked)}
                className="mt-1"
            />
            <div className="flex flex-col">

                <label
                    htmlFor={id}
                    className="cursor-pointer 2xl:text-lg"
                >
                    {label}
                </label>
                {descricao && (
                    <span className="text-sm text-gray-600">
                        {descricao}
                    </span>
                )}
            </div>
        </div>
    );
}