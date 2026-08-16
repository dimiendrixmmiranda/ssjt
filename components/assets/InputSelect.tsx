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
    placeholder?: string;
    opcoes: OpcaoSelect<T>[];
    setValor: (valor: T) => void;
}

export default function InputSelect<T>({
    label,
    id,
    nome,
    valor,
    icone,
    placeholder = "Selecione",
    opcoes,
    setValor,
}: InputSelectProps<T>) {

    return (
        <div className="flex flex-col w-full 2xl:gap-1">

            <label htmlFor={id} className="2xl:text-lg">
                {label}
            </label>

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
                    onChange={(e) => {
                        const opcaoSelecionada = opcoes.find(
                            (opcao) => String(opcao.valor) === e.target.value
                        );

                        if (opcaoSelecionada) {
                            setValor(opcaoSelecionada.valor);
                        }
                    }}
                    className="shadow-[0px_0px_2px_1px_#999] p-1 py-2 rounded-lg pl-8 text-lg transition-all duration-200 focus:outline-verde w-full"
                >

                    <option value="">
                        {placeholder}
                    </option>

                    {opcoes.map((opcao) => (
                        <option
                            key={String(opcao.valor)}
                            value={String(opcao.valor)}
                        >
                            {opcao.label}
                        </option>
                    ))}

                </select>

            </div>
        </div>
    );
}