'use client'
import { Especialidade, Prestador, Procedimento } from "@/app/generated/prisma/client"
import InputEmail from "@/components/assets/inputs/InputEmail"
import InputSelect from "@/components/assets/inputs/InputSelect"
import InputTexto from "@/components/assets/inputs/InputTexto"
import { useState } from "react"
import { FaListCheck, FaRegBuilding, FaStethoscope, FaUserDoctor } from "react-icons/fa6"
import { MdDriveFileRenameOutline, MdEmail, MdNumbers, MdOutlineNotes, MdPhone, MdSave } from "react-icons/md"
import { PiBroomFill } from "react-icons/pi"
import { GrStatusInfo } from "react-icons/gr";
import { useEspecialidades } from "@/hooks/useEspecialidades"
import { useProcedimentos } from "@/hooks/useProcedimentos"
import { gerarCodigoTresDigitos } from "@/lib/utils"
import { usePrestadores } from "@/hooks/usePrestadores"
import { Dialog } from "primereact/dialog"
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator"
import { TiUserDelete } from "react-icons/ti"
import { RiDeleteBin5Line } from "react-icons/ri"
import { BiSolidEdit } from "react-icons/bi"
import { AiOutlineSelect } from "react-icons/ai"
import { opcoesDeConvenio } from "@/lib/opcoesDeDados"
import { useDialog } from "@/context/DialogContext"

export default function Page() {
    const { especialidades } = useEspecialidades()
    const { procedimentos } = useProcedimentos()
    const { prestadores, buscarPrestadores } = usePrestadores()
    const { abrirDialog } = useDialog()
    console.log(prestadores)

    const [nome, setNome] = useState('')
    const [codigo, setCodigo] = useState('')
    const [situacao, setSituacao] = useState('')
    const [especialidadesRealizadas, setEspecialidadesRealizadas] = useState<Especialidade[]>([])
    const [buscaEspecialidade, setBuscaEspecialidade] = useState('')

    const [procedimentosRealizados, setProcedimentosRealizados] = useState<Procedimento[]>([])
    const [buscarProcedimento, setBuscarProcedimento] = useState('')

    const [telefone, setTelefone] = useState('')
    const [email, setEmail] = useState('')
    const [observacoes, setObservacoes] = useState('')

    const [editar, setEditar] = useState(false);

    const [first, setFirst] = useState(0)
    const [rows] = useState(5)

    const prestadoresPaginados = prestadores.slice(
        first,
        first + rows
    )

    const especialidadesFiltradas = especialidades.filter((especialidade) =>
        especialidade.nome
            .toLowerCase()
            .includes(buscaEspecialidade.toLowerCase()) &&
        !especialidadesRealizadas.some(
            (item) => item.id === especialidade.id
        )
    )

    const procedimentosFiltrados = procedimentos.filter((procedimento) =>
        procedimento.nome
            .toLowerCase()
            .includes(buscarProcedimento.toLowerCase()) &&
        !procedimentosRealizados.some(
            (item) => item.id === procedimento.id
        )
    )

    const opcoesDeSituacao = [
        {
            valor: '',
            label: 'Selecione'
        },
        {
            valor: 'ATIVO',
            label: 'Ativo'
        },
        {
            valor: 'INATIVO',
            label: 'Inativo'
        },

    ]

    const [convenio, setConvenio] = useState('')

    const onSubmitSalvarPrestador = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const resposta = await fetch("/api/prestador", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome,
                    codigo,
                    ativo: situacao === "ATIVO",
                    rede: convenio,
                    telefone,
                    email,
                    observacoes,
                    especialidades: especialidadesRealizadas.map(
                        (especialidade) => especialidade.id
                    ),
                    procedimentos: procedimentosRealizados.map(
                        (procedimento) => procedimento.id
                    ),
                }),
            })

            const resultado = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro || "Erro ao cadastrar prestador."
                )
            }

            console.log("Prestador cadastrado:", resultado)

        } catch (error) {
            console.error("Erro ao cadastrar prestador:", error)
        }
    }

    const removerPrestador = (prestador: Prestador) => {
        console.log(prestador)

        if (!prestador) {
            abrirDialog({
                title: "Erro",
                message: "Prestador não encontrado.",
            })

            return
        }

        abrirDialog({
            title: "Excluir Prestador",
            message: `Deseja realmente excluir o prestador "${prestador.nome}"?`,
            confirmText: "Excluir",
            cancelText: "Cancelar",

            onConfirm: async () => {
                try {
                    const response = await fetch(
                        `/api/prestador/${prestador.id}`,
                        {
                            method: "DELETE",
                        }
                    )

                    const data = await response.json()

                    if (!response.ok) {
                        throw new Error(
                            data.erro ||
                            data.error ||
                            "Erro ao excluir prestador."
                        )
                    }

                    await buscarPrestadores()

                    abrirDialog({
                        title: "Exclusão realizada",
                        message: `O prestador "${prestador.nome}" foi excluído com sucesso.`,
                    })

                } catch (error) {
                    console.error("Erro ao excluir prestador:", error)

                    abrirDialog({
                        title: "Erro",
                        message:
                            error instanceof Error
                                ? error.message
                                : "Erro ao excluir prestador.",
                    })
                }
            },
        })
    }

    const formulario = () => {
        return (
            <form
                className="flex flex-col gap-4"
                onSubmit={onSubmitSalvarPrestador}
            >
                {/* Informações principais */}
                <div className="grid grid-cols-2 gap-4">
                    <InputTexto
                        icone={<MdDriveFileRenameOutline />}
                        id="nome"
                        label="Nome do Prestador"
                        nome="nome"
                        placeholder="Digite o nome do prestador"
                        setValor={setNome}
                        valor={nome}
                    />
                    <div className="flex items-center gap-2">
                        <InputTexto icone={<MdDriveFileRenameOutline />} id="codigo" label="Código" nome="codigo" placeholder="Digite ou gere o código" setValor={setCodigo} valor={codigo} />
                        <button
                            className="whitespace-nowrap flex justify-center items-center mt-auto bg-verde px-3 h-[40px] rounded-lg font-bold text-white text-shadow-[1px_1px_2px_black]"
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                setCodigo(gerarCodigoTresDigitos())
                            }}
                        >
                            Gerar Código
                        </button>
                    </div>
                    {/* Especialidades */}
                    <div className="flex flex-col gap-1 relative col-span-2">
                        <label
                            htmlFor="buscaEspecialidade"
                            className="font-semibold text-zinc-700"
                        >
                            Especialidades que realiza
                        </label>
                        <input
                            id="buscaEspecialidade"
                            type="text"
                            value={buscaEspecialidade}
                            onChange={(e) => setBuscaEspecialidade(e.target.value)}
                            placeholder="Digite o nome da especialidade..."
                            autoComplete="off"
                            className="
                                w-full
                                border border-zinc-300
                                rounded-lg
                                px-3 py-2
                                outline-none
                                focus:border-verde
                                focus:ring-1
                                focus:ring-verde
                            "
                        />
                        {buscaEspecialidade.trim() !== '' && (
                            <div className="
                                absolute
                                left-0
                                right-0
                                z-50
                                top-20
                                bg-white
                                border
                                border-zinc-200
                                rounded-lg
                                shadow-lg
                                overflow-hidden
                            ">
                                {especialidadesFiltradas.length > 0 ? (
                                    especialidadesFiltradas.map((especialidade) => (
                                        <button
                                            type="button"
                                            key={especialidade.id}
                                            onClick={() => {
                                                setEspecialidadesRealizadas([
                                                    ...especialidadesRealizadas,
                                                    especialidade
                                                ])
                                                setBuscaEspecialidade('')
                                            }}
                                            className="
                                                w-full
                                                text-left
                                                px-4 py-3
                                                hover:bg-green-50
                                                border-b
                                                border-zinc-100
                                                transition
                                            "
                                        >
                                            <p className="font-semibold text-zinc-800">
                                                {especialidade.nome}
                                            </p>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-zinc-500">
                                        Nenhuma especialidade encontrada.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Selecionadas */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {especialidadesRealizadas.map((especialidade) => (
                                <div
                                    key={especialidade.id}
                                    className="
                                        flex items-center gap-2
                                        bg-green-50
                                        border border-green-200
                                        text-green-800
                                        rounded-lg
                                        px-3 py-1.5
                                    "
                                >
                                    <span>{especialidade.nome}</span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEspecialidadesRealizadas(
                                                especialidadesRealizadas.filter(
                                                    (item) => item.id !== especialidade.id
                                                )
                                            )
                                        }
                                        className="font-bold hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Procedimentos */}
                    <div className="flex flex-col gap-1 relative col-span-2">

                        <label
                            htmlFor="buscaProcedimento"
                            className="font-semibold text-zinc-700"
                        >
                            Procedimentos que realiza
                        </label>

                        <input
                            id="buscaProcedimento"
                            type="text"
                            value={buscarProcedimento}
                            onChange={(e) => setBuscarProcedimento(e.target.value)}
                            placeholder="Digite o nome do procedimento..."
                            autoComplete="off"
                            className="
                                w-full
                                border border-zinc-300
                                rounded-lg
                                px-3 py-2
                                outline-none
                                focus:border-verde
                                focus:ring-1
                                focus:ring-verde
                            "
                        />

                        {buscarProcedimento.trim() !== '' && (
                            <div className="
                                absolute
                                top-18
                                left-0
                                right-0
                                z-50
                                mt-1
                                bg-white
                                border
                                border-zinc-200
                                rounded-lg
                                shadow-lg
                                overflow-hidden
                            ">
                                {procedimentosFiltrados.length > 0 ? (
                                    procedimentosFiltrados.map((procedimento) => (
                                        <button
                                            type="button"
                                            key={procedimento.id}
                                            onClick={() => {
                                                setProcedimentosRealizados([
                                                    ...procedimentosRealizados,
                                                    procedimento
                                                ])
                                                setBuscarProcedimento('')
                                            }}
                                            className="
                                                w-full
                                                text-left
                                                px-4 py-3
                                                hover:bg-green-50
                                                border-b
                                                border-zinc-100
                                                transition
                                            "
                                        >
                                            <p className="font-semibold text-zinc-800">
                                                {procedimento.nome}
                                            </p>

                                            {procedimento.codigo && (
                                                <span className="text-sm text-zinc-500">
                                                    Código: {procedimento.codigo}
                                                </span>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-zinc-500">
                                        Nenhum procedimento encontrado.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Selecionados */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {procedimentosRealizados.map((procedimento) => (
                                <div
                                    key={procedimento.id}
                                    className="
                                        flex items-center gap-2
                                        bg-green-50
                                        border border-green-200
                                        text-green-800
                                        rounded-lg
                                        px-3 py-1.5
                                    "
                                >
                                    <span>{procedimento.nome}</span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProcedimentosRealizados(
                                                procedimentosRealizados.filter(
                                                    (item) => item.id !== procedimento.id
                                                )
                                            )
                                        }
                                        className="font-bold hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputSelect
                                icone={<GrStatusInfo />}
                                id="situacao"
                                label="Situação"
                                nome="situacao"
                                setValor={setSituacao}
                                valor={situacao}
                                opcoes={opcoesDeSituacao}
                            />
                        </div>
                        <div>
                            <InputSelect
                                icone={<AiOutlineSelect />}
                                id="convenio"
                                label="Convênio"
                                nome="convenio"
                                setValor={setConvenio}
                                valor={convenio}
                                opcoes={opcoesDeConvenio}
                            />
                        </div>
                    </div>
                    {/* Contatos */}
                    <div className="grid grid-cols-2 gap-4">
                        <InputTexto
                            icone={<MdPhone />}
                            id="telefone"
                            label="Telefone"
                            nome="telefone"
                            placeholder="Digite o telefone"
                            setValor={setTelefone}
                            valor={telefone}
                        />
                        <InputEmail
                            icone={<MdEmail />}
                            id="email"
                            label="E-mail"
                            nome="email"
                            placeholder="Digite o e-mail"
                            setValor={setEmail}
                            valor={email}
                        />
                    </div>
                </div>
                {/* Observações */}
                <div>
                    <InputTexto
                        icone={<MdOutlineNotes />}
                        id="observacoes"
                        label="Observações"
                        nome="observacoes"
                        placeholder="Digite alguma observação"
                        setValor={setObservacoes}
                        valor={observacoes}
                    />
                </div>
                {/* Botões */}
                <div className="grid grid-cols-2 gap-2 w-fit ml-auto mt-2">
                    <button
                        type="button"
                        // onClick={limparFormulario}
                        className="bg-red-500 text-white font-bold text-lg px-4 py-2 rounded-lg flex items-center gap-2 text-shadow-[1px_1px_2px_black]"
                    >
                        <PiBroomFill />
                        <p>Limpar</p>
                    </button>

                    <button
                        type="submit"
                        className="bg-verde text-white font-bold text-lg px-4 py-2 rounded-lg flex items-center gap-2 text-shadow-[1px_1px_2px_black]"
                    >
                        <MdSave />
                        <p>Salvar</p>
                    </button>

                </div>
            </form>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center gap-2">
                <div className="text-5xl">
                    <FaRegBuilding />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Prestadores</h3>
                    <span>Gerencie os prestadores de atendimento cadastrados no sistema.</span>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                    {formulario()}
                </div>
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xl font-bold text-verde">
                        <FaListCheck />
                        <h2>Cadastro Existentes</h2>
                    </div>
                    {/* filtros */}
                    {/* <div className="grid grid-cols-3 gap-4 2xl:grid-cols-4 2xl:gap-4">
                                            <InputTexto estiloPersonalizado="col-span-3 2xl:col-span-1" icone={<MdDriveFileRenameOutline />} id="buscarNomeCodigo" label="Buscar por Nome ou código" nome="buscarNomeCodigo" placeholder="Buscar por nome ou código" setValor={setBuscarNomeCodigo} valor={buscarNomeCodigo} />
                                            <InputSelect icone={<FaMagnifyingGlass />} id="filtroCategoria" label="Filtrar por categoria" nome="filtroCategoria" setValor={setFiltroCategoria} valor={filtroCategoria} opcoes={[{ label: 'Consulta', valor: 'CONSULTA' }, { label: 'Procedimento', valor: "PROCEDIMENTO" }, { label: 'Cirurgia', valor: 'CIRURGIA' }]} />
                                            <InputSelect icone={<GrStatusInfo />} id="filtroStatus" label="Filtrar por status" nome="filtroStatus" setValor={setFiltroStatus} valor={filtroStatus} opcoes={[{ label: 'Ativo', valor: 'CONSULTA' }, { label: 'Inativo', valor: "PROCEDIMENTO" }]} />
                                            <button className="flex items-center justify-center bg-verde text-white rounded-xl gap-2 text-lg font-bold mt-auto h-[40px]">
                                                <FaMagnifyingGlassPlus />
                                                <p>Buscar</p>
                                            </button>
                                        </div> */}

                    {/* Tabela */}
                    <div className="flex flex-col overflow-hidden">
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[1650px]">
                                <ul className="grid grid-cols-[230px_80px_230px_230px_150px_400px_150px_150px] w-full font-bold border-b p-3">
                                    <li>
                                        <p>Nome</p>
                                    </li>
                                    <li className="flex items-center justify-center text-center">
                                        <p>Código</p>
                                    </li>
                                    <li className="flex items-center justify-center text-center">
                                        <p>Especialidades</p>
                                    </li>
                                    <li className="flex items-center justify-center text-center">
                                        <p>Procedimentos</p>
                                    </li>
                                    <li className="flex items-center justify-center text-center">
                                        <p>Telefone</p>
                                    </li>
                                    <li className="flex items-center justify-center text-center">
                                        <p>Email</p>
                                    </li>
                                    <li className="flex items-center justify-center text-center">
                                        <p>Situação</p>
                                    </li>
                                    <li className="flex items-center justify-center text-center">
                                        <p>Ações</p>
                                    </li>
                                </ul>
                                <div>
                                    {
                                        prestadoresPaginados.length > 0 ? (
                                            <ul className="flex flex-col gap-2">
                                                {
                                                    prestadoresPaginados.map((prestador, i) => {
                                                        return (
                                                            <li key={i} className="grid grid-cols-[230px_80px_230px_230px_150px_400px_150px_150px] w-full border-b items-center p-3">
                                                                <div className="flex justify-center items-center text-center">
                                                                    <p>{prestador.nome}</p>
                                                                </div>
                                                                <div className="flex justify-center items-center text-center">
                                                                    <p>{prestador.codigo}</p>
                                                                </div>
                                                                <div className="flex justify-center items-center text-center">
                                                                    <p>Lista de Especialidades</p>
                                                                </div>
                                                                <div className="flex justify-center items-center text-center">
                                                                    <p>Lista de Procedimentos</p>
                                                                </div>
                                                                <div className="flex justify-center items-center text-center">
                                                                    <p>{prestador.telefone}</p>
                                                                </div>
                                                                <div className="flex justify-center items-center text-center">
                                                                    <p>{prestador.email}</p>
                                                                </div>
                                                                <div className="flex justify-center items-center text-center">
                                                                    <p>{prestador.ativo ? 'Ativo' : 'Inativo'}</p>
                                                                </div>
                                                                <div className="grid grid-cols-3">
                                                                    <button className="flex justify-center items-center rounded-full border border-amber-500 text-amber-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-amber-500 hover:text-white" ><BiSolidEdit /></button>
                                                                    <button className="flex justify-center items-center rounded-full border border-red-500 text-red-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-red-500 hover:text-white" onClick={() => removerPrestador(prestador)}><RiDeleteBin5Line /></button>
                                                                    <button className="flex justify-center items-center rounded-full border border-purple-600 text-purple-600 w-8 h-8 mx-auto duration-200 transition-all hover:bg-purple-600 hover:text-white"><TiUserDelete /></button>
                                                                </div>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        ) : (
                                            <div className="flex justify-center items-center text-center">
                                                <h4>Sem especialidades cadastradas</h4>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog header="Editar Especialidade" visible={editar} style={{ width: '50vw' }} onHide={() => setEditar(false)}>
                {formulario()}
            </Dialog>
        </div>
    )
}