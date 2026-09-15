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
        <label
            htmlFor={id}
            className="
                group
                flex
                items-start
                gap-3
                w-full
                cursor-pointer
                select-none
                rounded-lg
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                transition-all
                duration-200

                hover:border-blue-300
                hover:bg-blue-50/40

                has-[:checked]:border-blue-500
                has-[:checked]:bg-blue-50

                has-[:focus-visible]:ring-2
                has-[:focus-visible]:ring-blue-500/30
            "
        >
            {/* Checkbox */}
            <div className="relative mt-0.5 shrink-0">
                <input
                    type="checkbox"
                    name={nome}
                    id={id}
                    checked={valor}
                    onChange={(e) => setValor(e.target.checked)}
                    className="
                        peer
                        sr-only
                    "
                />

                <div
                    className="
                        flex
                        h-8
                        w-10
                        items-center
                        justify-center
                        rounded-md
                        border-2
                        border-gray-300
                        bg-white
                        transition-all
                        duration-200
                        my-auto

                        peer-checked:border-blue-600
                        peer-checked:bg-blue-600

                        peer-focus-visible:ring-2
                        peer-focus-visible:ring-blue-500/30

                        group-hover:border-blue-400
                    "
                >
                    {/* Check */}
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="
                            h-3.5
                            w-3.5
                            text-white
                            opacity-0
                            scale-75
                            transition-all
                            duration-150

                            peer-checked:opacity-100
                            peer-checked:scale-100
                        "
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12.5l4.5 4.5L19 7.5"
                        />
                    </svg>
                </div>
            </div>

            {/* Texto */}
            <div className="flex min-w-0 flex-col gap-0.5">
                <span
                    className="
                        text-sm
                        font-medium
                        leading-4.5
                        text-gray-700
                        transition-colors

                        group-hover:text-gray-900
                    "
                >
                    {label}
                </span>

                {descricao && (
                    <span
                        className="
                            text-xs
                            leading-4
                            text-gray-500 line-clamp-2
                        "
                    >
                        {descricao}
                    </span>
                )}
            </div>
        </label>
    )
}