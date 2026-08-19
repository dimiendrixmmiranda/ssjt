'use client'
import InputSelect from "@/components/assets/InputSelect";
import InputTextArea from "@/components/assets/InputTextArea";
import InputTexto from "@/components/assets/InputTexto";
import { useEspecialidades } from "@/hooks/useEspecialidades";
import { useState } from "react";
import { AiOutlineSelect } from "react-icons/ai";
import { BsBuildingAdd } from "react-icons/bs";
import { MdDriveFileRenameOutline } from "react-icons/md";

export default function Locais() {
    const [nome, setNome] = useState('')
    const [tipoDoLocal, setTipoDoLocal] = useState('')
    const [cidade, setCidade] = useState('')
    const [cep, setCep] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [bairro, setBairro] = useState('')
    const [complemento, setComplemento] = useState('')
    const [telefone1, setTelefone1] = useState('')
    const [telefone2, setTelefone2] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('')
    const [tipoDeAtendimento, setTipoDeAtendimento] = useState('')
    const [tiposDeAtendimento, setTiposDeAtendimento] = useState<string[]>([])
    const [descricao, setDescricao] = useState('')
    const { especialidades } = useEspecialidades()

    const adicionarTipoDeAtendimento = () => {
        if (!tipoDeAtendimento) {
            alert("Selecione um tipo de atendimento.")
            return
        }

        if (tiposDeAtendimento.includes(tipoDeAtendimento)) {
            alert("Esse tipo de atendimento já foi adicionado.")
            return
        }

        setTiposDeAtendimento((prev) => [
            ...prev,
            tipoDeAtendimento
        ])

        setTipoDeAtendimento('')
    }

    const removerTipoDeAtendimento = (tipo: string) => {
        setTiposDeAtendimento((prev) =>
            prev.filter((item) => item !== tipo)
        )
    }

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault()

        try {

            if (!nome.trim()) {
                throw new Error("Informe o nome do local.")
            }

            if (!tipoDoLocal) {
                throw new Error("Selecione o tipo do local.")
            }

            if (!status) {
                throw new Error("Selecione o status do local.")
            }

            if (!cidade.trim()) {
                throw new Error("Informe a cidade.")
            }

            console.log(tiposDeAtendimento)

            if (tiposDeAtendimento.length === 0) {
                throw new Error(
                    "Adicione pelo menos um tipo de atendimento."
                )
            }

            const local = {
                nome: nome.trim(),

                tipoDoLocal,

                cidade: cidade.trim(),

                cep: cep.trim() || null,

                rua: rua.trim() || null,

                numero: numero.trim() || null,

                bairro: bairro.trim() || null,

                complemento: complemento.trim() || null,

                telefone1: telefone1.trim() || null,

                telefone2: telefone2.trim() || null,

                email: email.trim() || null,

                status,

                descricao: descricao.trim() || null,

                tiposDeAtendimento,
            }

            console.log("LOCAL ENVIADO:", local)

            const response = await fetch("/api/locais", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(local),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.erro ||
                    data.error ||
                    "Erro ao cadastrar local."
                )
            }

            alert("Local cadastrado com sucesso!")

            // limparFormulario()

        } catch (error) {

            console.error(
                "Erro ao cadastrar local:",
                error
            )

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao cadastrar local."
            )
        }
    }

    // no banco de dados colocar na cidade ou fora da cidade
    const tiposDeLocal = [
        {
            valor: "POSTO_DE_SAUDE",
            label: "Posto de Saúde"
        },
        {
            valor: "CLINICA",
            label: "Clínica"
        },
        {
            valor: "HOSPITAL",
            label: "Hospital"
        },
    ]
    const statusDoLocal = [
        {
            valor: "ATIVO",
            label: "Ativo"
        },
        {
            valor: "INATIVO",
            label: "Inativo"
        },
    ]

    console.log(tiposDeAtendimento)
    return (
        <div className="p-4">
            <div className="mb-4">
                <h3 className="text-2xl font-bold">Locais de Atendimento</h3>
                <span>Gerencie e cadastre locais de atendimento.</span>
            </div>

            <div>
                <form
                    onSubmit={handleSubmit}
                    className="shadow-[0px_0px_2px_1px_#999] rounded-lg p-5 flex flex-col gap-5"
                >
                    <div className="flex items-center gap-2 text-xl font-bold text-verde border-b border-gray-300 pb-3">
                        <BsBuildingAdd />
                        <h2>
                            Novo Local de atendimento
                        </h2>
                    </div>
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <BsBuildingAdd />
                            <h3>
                                Informações do Local
                            </h3>
                        </div>
                        <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="nome"
                                label="Nome do Local *"
                                nome="nome"
                                placeholder="Informe o nome do local..."
                                setValor={setNome}
                                valor={nome}
                            />
                            <InputSelect
                                icone={<AiOutlineSelect />}
                                id="tipoDoLocal"
                                label="Tipo do Local *"
                                nome="tipoDoLocal"
                                setValor={setTipoDoLocal}
                                valor={tipoDoLocal}
                                opcoes={tiposDeLocal}
                            />

                            <InputSelect
                                icone={<AiOutlineSelect />}
                                id="status"
                                label="Status *"
                                nome="status"
                                setValor={setStatus}
                                valor={status}
                                opcoes={statusDoLocal}
                            />
                        </div>
                    </section>
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <span className="text-xl">⌖</span>
                            <h3>
                                Endereço
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="cidade"
                                label="Cidade *"
                                nome="cidade"
                                placeholder="Informe a cidade..."
                                setValor={setCidade}
                                valor={cidade}
                            />
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="cep"
                                label="CEP"
                                nome="cep"
                                placeholder="00000-000"
                                setValor={setCep}
                                valor={cep}
                            />
                        </div>
                        <div className="grid grid-cols-[1fr_140px_1fr_1fr] gap-3">
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="rua"
                                label="Rua / Avenida"
                                nome="rua"
                                placeholder="Informe o logradouro..."
                                setValor={setRua}
                                valor={rua}
                            />
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="numero"
                                label="Número"
                                nome="numero"
                                placeholder="Nº"
                                setValor={setNumero}
                                valor={numero}
                            />
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="bairro"
                                label="Bairro"
                                nome="bairro"
                                placeholder="Informe o bairro..."
                                setValor={setBairro}
                                valor={bairro}
                            />
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="complemento"
                                label="Complemento"
                                nome="complemento"
                                placeholder="Sala, bloco, etc..."
                                setValor={setComplemento}
                                valor={complemento}
                            />
                        </div>
                    </section>
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <span className="text-xl">☎</span>
                            <h3>
                                Informações de Contato
                            </h3>
                        </div>
                        <div className="grid grid-cols-[1fr_1fr_2fr] gap-3">
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="telefone1"
                                label="Telefone1"
                                nome="telefone1"
                                placeholder="(00) 00000-0000"
                                setValor={setTelefone1}
                                valor={telefone1}
                            />
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="telefone2"
                                label="Telefone 2"
                                nome="telefone2"
                                placeholder="(00) 00000-0000"
                                setValor={setTelefone2}
                                valor={telefone2}
                            />
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="email"
                                label="E-mail"
                                nome="email"
                                placeholder="email@exemplo.com"
                                setValor={setEmail}
                                valor={email}
                            />

                        </div>

                    </section>
                    <section className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <span className="text-xl">▤</span>
                            <h3>
                                Descrição
                            </h3>
                        </div>
                        <section className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-lg font-bold">
                                <span className="text-xl">▤</span>
                                <h3>
                                    Tipos de Atendimento
                                </h3>
                            </div>

                            <div className="grid grid-cols-[1fr_150px] gap-3 items-end">

                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="tipoDeAtendimento"
                                    label="Tipo de Atendimento"
                                    nome="tipoDeAtendimento"
                                    setValor={setTipoDeAtendimento}
                                    valor={tipoDeAtendimento}
                                    opcoes={especialidades.map((especialidade) => ({
                                        valor: especialidade.id,
                                        label: especialidade.nome
                                    }))}
                                />

                                <button
                                    type="button"
                                    onClick={adicionarTipoDeAtendimento}
                                    className="
                bg-verde
                text-white
                font-bold
                rounded-lg
                py-2
                hover:bg-verde-escuro
                transition-all
            "
                                >
                                    Adicionar
                                </button>

                            </div>

                            {/* TIPOS ADICIONADOS */}
                            {tiposDeAtendimento.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">

                                    {tiposDeAtendimento.map((tipoId) => {

                                        const tipo = especialidades.find(
                                            (especialidade) =>
                                                especialidade.id === tipoId
                                        )

                                        return (
                                            <div
                                                key={tipoId}
                                                className="
                            flex
                            items-center
                            gap-2
                            px-3
                            py-2
                            rounded-lg
                            bg-verde
                            text-white
                            font-semibold
                        "
                                            >
                                                <span>
                                                    {tipo?.nome}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removerTipoDeAtendimento(tipoId)
                                                    }
                                                    className="
                                text-white
                                hover:text-red-200
                                font-bold
                            "
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )
                                    })}

                                </div>
                            )}
                        </section>
                        <InputTextArea
                            id="descricao"
                            label="Descrição do Local"
                            nome="descricao"
                            placeholder="Informe observações ou informações adicionais sobre o local..."
                            setValor={setDescricao}
                            valor={descricao}
                            icone={<MdDriveFileRenameOutline />}
                            altura="h-[200px]"
                        />
                    </section>
                    {/* BOTÕES */}
                    <div className="flex justify-end gap-3 border-t border-gray-300 pt-4">
                        <button
                            type="button"
                            // onClick={limparFormulario}
                            className="
                                px-5
                                py-2
                                rounded-lg
                                border
                                border-verde
                                text-verde
                                font-bold
                                cursor-pointer
                                hover:bg-verde
                                hover:text-white
                                transition-all
                            "
                        >
                            Limpar
                        </button>
                        <button
                            type="submit"
                            className="
                                px-6
                                py-2
                                rounded-lg
                                bg-verde
                                text-white
                                font-bold
                                cursor-pointer
                                hover:bg-verde-escuro
                                transition-all
                            "
                        >
                            Cadastrar Local
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}