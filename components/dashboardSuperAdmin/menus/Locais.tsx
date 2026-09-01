'use client'
import InputSelect from "@/components/assets/InputSelect";
import InputTextArea from "@/components/assets/InputTextArea";
import InputTexto from "@/components/assets/InputTexto";
import { useEspecialidades } from "@/hooks/useEspecialidades";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineSelect } from "react-icons/ai";
import { BsBuildingAdd, BsBuildingDash, BsFillBuildingsFill } from "react-icons/bs";
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { GiMagnifyingGlass } from "react-icons/gi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RiLightbulbLine } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useDialog } from "@/context/DialogContext";
import { Local } from "@/app/generated/prisma/client";
import { useLocais } from "@/hooks/useLocais";


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

    const { abrirDialog } = useDialog()
    const {
        locais,
        buscarLocais
    } = useLocais()

    useEffect(() => {
        buscarLocais()
    }, [])

    // Filtros para busca
    const [buscarLocal, setBuscarLocal] = useState('')
    const [filtroStatus, setFiltroStatus] = useState('')
    const [filtroCidade, setFiltroCidade] = useState('')
    const [first, setFirst] = useState(0)
    const [rows] = useState(5)

    useEffect(() => {
        setFirst(0)
    }, [
        buscarLocal,
        filtroCidade,
        filtroStatus
    ])

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

    const cadastrarLocal = async (local: any) => {
        try {
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

            await buscarLocais()

            abrirDialog({
                title: "Cadastro realizado",
                message: "O local foi cadastrado com sucesso.",
            })

        } catch (error) {
            console.error("Erro ao cadastrar local:", error)

            abrirDialog({
                title: "Erro",
                message:
                    error instanceof Error
                        ? error.message
                        : "Erro ao cadastrar local.",
            })
        }
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

            abrirDialog({
                title: "Confirmar cadastro",
                message: `Deseja realmente cadastrar o local "${local.nome}"?`,
                confirmText: "Cadastrar",
                cancelText: "Cancelar",

                onConfirm: async () => {
                    await cadastrarLocal(local)
                }
            })

        } catch (error) {

            abrirDialog({
                title: "Atenção",
                message:
                    error instanceof Error
                        ? error.message
                        : "Erro ao validar o formulário."
            })
        }
    }

    const removerLocal = async (local: Local) => {
        abrirDialog({
            title: "Remover local",
            message: `Deseja realmente remover o local "${local.nome}"? Essa ação não poderá ser desfeita.`,
            confirmText: "Remover",
            cancelText: "Cancelar",

            onConfirm: async () => {
                try {
                    const response = await fetch("/api/locais", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id: local.id
                        })
                    })

                    const data = await response.json()

                    if (!response.ok) {
                        throw new Error(
                            data.erro ||
                            data.error ||
                            "Erro ao remover local."
                        )
                    }

                    // Atualiza a lista automaticamente
                    await buscarLocais()

                    abrirDialog({
                        title: "Local removido",
                        message: "O local foi removido com sucesso."
                    })

                } catch (error) {
                    console.error(
                        "Erro ao remover local:",
                        error
                    )

                    abrirDialog({
                        title: "Erro",
                        message:
                            error instanceof Error
                                ? error.message
                                : "Erro ao remover local."
                    })
                }
            }
        })
    }


    const locaisFiltrados = locais.filter((local) => {
        const correspondeStatus =
            !filtroStatus ||
            local.status === filtroStatus

        const correspondeCidade =
            !filtroCidade ||
            local.cidade
                .toLowerCase()
                .includes(filtroCidade.toLowerCase())

        const correspondeNome =
            !buscarLocal ||
            local.nome
                .toLowerCase()
                .includes(buscarLocal.toLowerCase())

        return (
            correspondeStatus &&
            correspondeCidade &&
            correspondeNome
        )
    })

    const locaisPaginados = locaisFiltrados.slice(
        first,
        first + rows
    )
    // no banco de dados colocar na cidade ou fora da cidade
    const tiposDeLocal = [
        {
            valor: "",
            label: "Selecione"
        },
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
            valor: "",
            label: "Selecione"
        },
        {
            valor: "ATIVO",
            label: "Ativo"
        },
        {
            valor: "INATIVO",
            label: "Inativo"
        },
    ]

    return (
        <div className="p-6 overflow-x-hidden max-h-[91.5vh]" id="adicionarLocal">
            <div className="mb-4">
                <h3 className="text-2xl font-bold">Locais de Atendimento</h3>
                <span>Gerencie e cadastre locais de atendimento.</span>
            </div>
            <div className="flex flex-col gap-6">
                <form
                    onSubmit={handleSubmit}
                    className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-5 flex flex-col gap-5"
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
                        <div className="grid grid-cols-[1fr_140px_1fr] gap-3">
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
                            <div className="col-span-3">
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
                                    opcoes={
                                        [
                                            {
                                                valor: '',
                                                label: "Selecione"
                                            },
                                            ...especialidades.map((especialidade) => ({
                                                valor: especialidade.id,
                                                label: especialidade.nome
                                            }))
                                        ]
                                    }
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
                        <div>
                            <div className="flex items-center gap-2 text-lg font-bold">
                                <span className="text-xl">▤</span>
                                <h3>
                                    Descrição
                                </h3>
                            </div>
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
                        </div>
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
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-5 flex flex-col gap-5 overflow-x-hidden">
                    <div className="flex items-center gap-2 text-xl font-bold text-verde border-b border-gray-300 pb-3">
                        <BsFillBuildingsFill />
                        <h2>
                            Lista de Locais de Atendimento
                        </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <InputTexto
                            icone={<MdDriveFileRenameOutline />}
                            id="buscarLocal"
                            label="Buscar local"
                            nome="buscarLocal"
                            placeholder="Digite o nome do local..."
                            setValor={setBuscarLocal}
                            valor={buscarLocal}
                        />
                        <InputTexto
                            icone={<MdDriveFileRenameOutline />}
                            id="filtroCidade"
                            label="Cidade"
                            nome="filtroCidade"
                            placeholder="Digite a cidade..."
                            setValor={setFiltroCidade}
                            valor={filtroCidade}
                        />
                        <InputSelect
                            icone={<AiOutlineSelect />}
                            id="filtroStatus"
                            label="Status"
                            nome="filtroStatus"
                            setValor={setFiltroStatus}
                            valor={filtroStatus}
                            opcoes={[
                                {
                                    valor: "",
                                    label: "Todos"
                                },
                                {
                                    valor: "ATIVO",
                                    label: "Ativo"
                                },
                                {
                                    valor: "INATIVO",
                                    label: "Inativo"
                                }
                            ]}
                        />
                    </div>
                    {
                        locaisPaginados.length > 0 ? (
                            <div className="flex flex-col overflow-x-scroll">
                                <ul className="grid grid-cols-[200px_170px_120px_180px_140px_100px_190px] 2xl:grid-cols-[200px_170px_120px_1fr_140px_100px_190px] w-full font-bold border-b">
                                    <li className="p-3">
                                        <p>Nome do Local</p>
                                    </li>
                                    <li className="p-3 text-center">
                                        <p>Tipo do Local</p>
                                    </li>
                                    <li className="p-3 text-center">
                                        <p>Cidade</p>
                                    </li>
                                    <li className="p-3 text-center">
                                        <p>Endereço</p>
                                    </li>
                                    <li className="p-3 text-center">
                                        <p>Telefone</p>
                                    </li>
                                    <li className="p-3 text-center">
                                        <p>Status</p>
                                    </li>
                                    <li className="p-3 text-center">
                                        <p>Ações</p>
                                    </li>
                                </ul>
                                <ul>
                                    {
                                        locaisPaginados.map((local) => {
                                            return (
                                                <li key={local.id} className="border-b">
                                                    <ul className="grid grid-cols-[200px_170px_120px_180px_140px_100px_190px] 2xl:grid-cols-[200px_170px_120px_1fr_140px_100px_190px]">
                                                        <li className="p-3">
                                                            <p>{local.nome}</p>
                                                        </li>
                                                        <li className="p-3 text-center my-auto">
                                                            <p className="capitalize">{local.tipoDoLocal.replaceAll('_', ' ').toLowerCase()}</p>
                                                        </li>
                                                        <li className="p-3 text-center my-auto">
                                                            <p>{local.cidade}</p>
                                                        </li>
                                                        <li className="p-3 text-center line-clamp-2 overflow-hidden my-auto">
                                                            <p className="line-clamp-2 overflow-hidden">{local.rua}, {local.numero} - {local.bairro} {local.complemento ? `(${local.complemento})` : ''}</p>
                                                        </li>
                                                        <li className="p-3 text-center my-auto">
                                                            <p>{local.telefone1}</p>
                                                        </li>
                                                        <li className={`py-2 text-center my-auto rounded-lg h-fit text-white font-bold ${local.status === 'ATIVO' ? 'bg-green-600' : 'bg-red-600'}`}>
                                                            <p>{local.status}</p>
                                                        </li>
                                                        <li className="p-3 text-center grid grid-cols-4 w-full items-center self-center gap-2">
                                                            <button className="flex justify-center items-center rounded-full w-10 h-10 font-bold border border-green-600 text-green-600 duration-200 transition-all hover:bg-green-600 hover:text-white">
                                                                <BsBuildingDash />
                                                            </button>
                                                            <button onClick={() => removerLocal(local)} className="flex justify-center items-center rounded-full w-10 h-10 font-bold border border-red-600 text-red-600 duration-200 transition-all hover:bg-red-600 hover:text-white">
                                                                <FaRegTrashAlt />
                                                            </button>
                                                            <button className="flex justify-center items-center rounded-full w-10 h-10 font-bold border border-amber-600 text-amber-600 duration-200 transition-all hover:bg-amber-600 hover:text-white">
                                                                <FaRegEdit />
                                                            </button>
                                                            <button className="flex justify-center items-center rounded-full w-10 h-10 font-bold border border-blue-600 text-blue-600 duration-200 transition-all hover:bg-blue-600 hover:text-white">
                                                                <FaRegEye />
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>

                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-6">
                                <div className="relative w-full h-full">
                                    <Image alt="image" src={'/mulher.png'} fill className="object-contain" />
                                </div>
                                <div className="text-verde-escuro flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-lg">
                                        <GiMagnifyingGlass />
                                        <h5>Resultado da busca:</h5>
                                    </div>
                                    <div>
                                        <h3 className="text-verde-escuro text-3xl font-bold 2xl:text-4xl 3xl:text-[44px]">Nenhum resultado encontrado</h3>
                                        <span className="text-zinc-500 2xl:text-lg">Não encontramos nenhum registro com os criterios informados: "{buscarLocal}"</span>
                                    </div>
                                    <div className="border border-verde-escuro rounded-lg p-4 bg-verde-escuro/10 flex flex-col gap-2">
                                        <div className="flex items-center text-xl font-bold">
                                            <RiLightbulbLine />
                                            <p>Dicas para uma nova busca:</p>
                                        </div>
                                        <div>
                                            <ul>
                                                <li className="flex items-center gap-2">
                                                    <IoIosCheckmarkCircle />
                                                    <p>Verifique se os dados estão corretos.</p>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IoIosCheckmarkCircle />
                                                    <p>Tente usar menos filtros na pesquisa</p>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IoIosCheckmarkCircle />
                                                    <p>Utilize parte do nome ou CPF.</p>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IoIosCheckmarkCircle />
                                                    <p>Confira se não há espaços extras.</p>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 max-w-[700px] ml-auto">
                                            <button className="flex items-center justify-center cursor-pointer gap-2 font-bold border border-red-500 p-1 rounded-lg px-3 transition-all duration-300 bg-red-500 text-white hover:bg-white hover:text-red-500">
                                                <TiDeleteOutline />
                                                <h2>Limpar Filtros</h2>
                                            </button>
                                            <Link href={'#adicionarLocal'} className="flex items-center justify-center cursor-pointer gap-2 font-bold border border-verde p-1 rounded-lg px-3 transition-all duration-300 hover:bg-verde hover:text-white">
                                                <IoAdd />
                                                <h2>Adicionar novo Local</h2>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <div className="grid grid-cols-[300px_1fr] mt-auto -mb-2">
                        <p className="my-auto">Mostrando 1 a 5 de 5 registros</p>
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={locaisFiltrados.length}
                            onPageChange={(event: PaginatorPageChangeEvent) => {
                                setFirst(event.first)
                            }}
                            className="my-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}