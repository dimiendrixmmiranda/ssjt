import React from "react";

interface OpcaoSelect<T> {
    valor: T;
    label: string;
}

interface InputSelectProps<T> {
    label: string;
    id: string;
    nome: string;
    valor: T;
    icone: React.ReactNode;
    disabled?: boolean;
    campoObrigatorio?: boolean
    estiloPersonalizado?: string
    opcoes: OpcaoSelect<T>[];
    setValor: (valor: T) => void;
}

export default function InputSelect<T>({
    label,
    id,
    nome,
    valor,
    icone,
    disabled,
    opcoes,
    campoObrigatorio,
    estiloPersonalizado,
    setValor,
}: InputSelectProps<T>) {

    return (
        <div className={`flex flex-col w-full ${estiloPersonalizado}`}>
            <div className="flex items-center gap-2">
                <label htmlFor={id} className="2xl:text-lg">
                    {label}
                </label>
                {
                    campoObrigatorio && (<p className="font-bold text-2xl leading-3 text-red-600 mt-2">*</p>)
                }
            </div>
            <div className="relative">
                <div
                    className="absolute left-2 top-[50%] z-10 text-xl"
                    style={{ transform: "translate(0,-50%)" }}
                >
                    {icone}
                </div>
                <select
                    name={nome}
                    id={id}
                    value={String(valor)}
                    disabled={disabled}
                    onChange={(e) => {
                        const opcaoSelecionada = opcoes.find(
                            (opcao) => String(opcao.valor) === e.target.value
                        );

                        if (opcaoSelecionada) {
                            setValor(opcaoSelecionada.valor);
                        }
                    }}
                    className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] p-1 py-2 rounded-lg pl-8 text-lg transition-all duration-200 focus:outline-verde w-full h-[39px] capitalize"
                >
                    {opcoes.map((opcao) => (
                        <option
                            key={String(opcao.valor)}
                            value={String(opcao.valor)}
                            className="capitalize"
                        >
                            {opcao.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}