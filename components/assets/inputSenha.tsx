import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import { useState } from "react"

interface InputSenhaProps {
    label: string
    id: string
    nome: string
    valor: string
    icone: React.ReactNode
    placeholder: string
    setValor: (valor: string) => void
}

export default function InputSenha({
    label,
    id,
    nome,
    valor,
    icone,
    placeholder,
    setValor
}: InputSenhaProps) {
    const [mostrarSenha, setMostrarSenha] = useState(false)
    return (
        <div className="flex flex-col w-full 2xl:gap-1">
            <label
                htmlFor={id}
                className="2xl:text-lg"
            >
                {label}
            </label>
            <div className="relative flex flex-col">
                <input
                    type={mostrarSenha ? "text" : "password"}
                    name={nome}
                    id={id}
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="shadow-[0px_0px_2px_1px_#999] p-1 rounded-lg pl-8 pr-9 text-lg transition-all duration-200 focus:outline-verde"
                    placeholder={placeholder}
                />
                <div
                    className="absolute top-[50%] left-1 text-xl"
                    style={{ transform: 'translate(0,-50%)' }}
                >
                    {icone}
                </div>
                <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute top-[50%] right-1 text-xl cursor-pointer"
                    style={{ transform: 'translate(0,-50%)' }}
                >
                    {mostrarSenha
                        ? <IoEyeOffOutline />
                        : <IoEyeOutline />
                    }
                </button>

            </div>

        </div>
    )
}