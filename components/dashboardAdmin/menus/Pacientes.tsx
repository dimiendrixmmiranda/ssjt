import InputSelect from "@/components/assets/InputSelect";
import InputTexto from "@/components/assets/InputTexto";
import { useState } from "react";
import { AiOutlineSelect } from "react-icons/ai";
import { IoAdd } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RiMenuSearchLine } from "react-icons/ri";

enum TipoDeDado {
    NOME = "NOME",
    DATA_DE_NASCIMENTO = "DATA_DE_NASCIMENTO",
    CPF = "CPF",
    CARTAO_SUS = "CARTAO_SUS",
    NOME_DA_MAE = "NOME_DA_MAE",
}
enum Condicao {
    CONTEM = "CONTEM",
    MAIOR_QUE = "MAIOR_QUE",
    MENOR_QUE = "MENOR_QUE",
    IGUAL = "IGUAL",
}

interface TipoDeDadoOption {
    valor: TipoDeDado;
    label: string;
}
interface CondicaoOption {
    valor: Condicao;
    label: string;
}
export default function Pacientes() {
    const [tipoDeDado, setTipoDeDado] = useState<TipoDeDado>()
    const [condicao, setCondicao] = useState<Condicao>()
    const [valor, setValor] = useState('')
    const tiposDeDados: TipoDeDadoOption[] = [
        {
            valor: TipoDeDado.NOME,
            label: "Nome",
        },
        {
            valor: TipoDeDado.CPF,
            label: "CPF",
        },
        {
            valor: TipoDeDado.CARTAO_SUS,
            label: "Cartão SUS",
        },
    ]
    const tiposDeCondicoes: CondicaoOption[] = [
        {
            valor: Condicao.CONTEM,
            label: "Contem",
        },
        {
            valor: Condicao.IGUAL,
            label: "Igual",
        },
        {
            valor: Condicao.MAIOR_QUE,
            label: "Maior Que",
        },
        {
            valor: Condicao.MENOR_QUE,
            label: "Menor Que",
        },
    ]

    console.log(tipoDeDado)

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="">
                <h3 className="text-2xl font-bold">Pacientes</h3>
                <span>Busque, adicione, edite um novo paciente.</span>
            </div>
            <div className="shadow-[0px_0px_2px_1px_#999] rounded-lg p-4 flex flex-col gap-3">
                <div className="flex justify-between">
                    <div className="flex items-center gap-2 text-xl font-bold text-verde">
                        <RiMenuSearchLine />
                        <h2>Realize uma nova busca</h2>
                    </div>
                    <button className="flex items-center cursor-pointer gap-2 text-xl font-bold text-verde border border-verde p-1 rounded-lg px-3 transition-all duration-300 hover:bg-verde hover:text-white">
                        <IoAdd />
                        <h2>Adicionar Cliente</h2>
                    </button>
                </div>
                <div className="grid grid-cols-[160px_160px_160px_1fr_140px] gap-2">
                    <InputSelect
                        icone={<AiOutlineSelect />}
                        id="tipoDeDado"
                        label="Tipo de busca"
                        nome="tipoDeDado"
                        setValor={setTipoDeDado}
                        valor={tipoDeDado}
                        opcoes={tiposDeDados}
                    />
                    <InputSelect
                        icone={<AiOutlineSelect />}
                        id="condicao"
                        label="Condição"
                        nome="condicao"
                        setValor={setCondicao}
                        valor={condicao}
                        opcoes={tiposDeCondicoes}
                    />
                    {/* falta o select de unidade do cliente */}
                    <InputSelect
                        icone={<AiOutlineSelect />}
                        id="condicao"
                        label="Condição"
                        nome="condicao"
                        setValor={setCondicao}
                        valor={condicao}
                        opcoes={tiposDeCondicoes}
                    />
                    {/* vai ter que ser um input especial depois */}
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="valor" label="Valor" nome="valor" placeholder="valor..." setValor={setValor} valor={valor} />
                    <button className="font-bold bg-verde text-white h-fit mt-auto py-2 rounded-lg">Buscar</button>
                </div>
            </div>
            <div className="shadow-[0px_0px_2px_1px_#999] rounded-lg p-4 flex flex-col gap-3">
                <div>
                    <div className="flex items-center gap-2 text-xl font-bold text-verde">
                        <RiMenuSearchLine />
                        <h2>Resultado da sua busca:</h2>
                    </div>
                </div>
                <div className="flex w-full">
                    <ul className="grid grid-cols-8 w-full">
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Nome</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Nascimento</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Idade</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Nome da mãe</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>CPF</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Cartão Sus</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Un. do Cliente</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Situação</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}