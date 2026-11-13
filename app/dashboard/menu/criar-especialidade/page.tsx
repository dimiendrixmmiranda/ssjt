'use client'
import { LuAmbulance } from "react-icons/lu";
import Template from "../Template";
import { useState } from "react";
import InputTexto from "@/components/inputs/InputTexto";
import { TbAmbulance } from "react-icons/tb";
import { AiOutlineClear } from "react-icons/ai";
import { HiSaveAs } from "react-icons/hi";
import DialogPersonalizado from "@/components/dialog/DialogPersonalizado";
import { CategoriaEspecialidade } from "@/generated/prisma/enums";
import { FaList, FaRegTrashAlt } from "react-icons/fa";
import { useEspecialidades } from "@/hooks/useEspecialidades";
import { FiEdit } from "react-icons/fi";
import { Dialog } from "primereact/dialog";
import { criarCodigoTresDigitos } from "@/utils/criarCodigoTresDigitos";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator"

export default function Page() {
    const { especialidades, buscarEspecialidades } = useEspecialidades()

    const [nomeDaEspecialidade, setNomeDaEspecialidade] = useState('')
    const [codigo, setCodigo] = useState('')
    const [categoria, setCategoria] = useState<string[]>([CategoriaEspecialidade.NORMAL, CategoriaEspecialidade.TFD])
    const [carregando, setCarregando] = useState(false)

    const [tituloResultado, setTituloResultado] = useState("");
    const [mensagemResultado, setMensagemResultado] = useState("");

    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
    const [dialogResultado, setDialogResultado] = useState(false);

    const [especialidadeAtual, setEspecialidadeAtual] = useState<typeof especialidades[number] | null>(null)

    const [dialogAtualizar, setDialogAtualizar] = useState(false)
    const [dialogStatus, setDialogStatus] = useState(false)
    const [dialogExcluir, setDialogExcluir] = useState(false)


    const [first, setFirst] = useState(0)
    const [rows, setRows] = useState(5)

    const especialidadesPaginadas = especialidades.slice(first, first + rows)

    function aoMudarPagina(event: PaginatorPageChangeEvent) {
        setFirst(event.first)
        setRows(event.rows)
    }

    async function cadastrarEspecialidade() {
        setDialogConfirmacao(false)

        try {
            setCarregando(true)

            const resposta = await fetch("/api/criar-especialidade", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nomeDaEspecialidade.trim(),
                    codigo: codigo.trim(),
                    categoria,
                }),
            })

            const resultado = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro || "Não foi possível cadastrar a especialidade."
                )
            }

            setTituloResultado("Cadastro realizado!")
            setMensagemResultado("Especialidade cadastrada com sucesso.")
            await buscarEspecialidades()
            limparFormulario()

        } catch (erro) {
            console.error("Erro ao cadastrar especialidade:", erro)

            setTituloResultado("Erro ao cadastrar")
            setMensagemResultado(
                erro instanceof Error
                    ? erro.message
                    : "Ocorreu um erro inesperado."
            )

        } finally {
            setCarregando(false)
            setDialogResultado(true)
        }
    }

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!nomeDaEspecialidade.trim() || !codigo.trim() || categoria.length === 0) {
            setTituloResultado("Campos obrigatórios")
            setMensagemResultado("Preencha todos os campos obrigatórios.")
            setDialogResultado(true)
            return
        }

        setDialogConfirmacao(true)
    }

    function limparFormulario() {
        setNomeDaEspecialidade("")
        setCodigo("")
        setCategoria([
            CategoriaEspecialidade.NORMAL,
            CategoriaEspecialidade.TFD
        ])
    }

    function cancelarCadastro() {
        setDialogConfirmacao(false)

        setTituloResultado("Cadastro cancelado")
        setMensagemResultado(
            "A operação foi cancelada. Nenhuma especialidade foi cadastrada."
        )

        setDialogResultado(true)
    }

    function abrirEdicao(especialidade: typeof especialidades[number]) {
        setEspecialidadeAtual(especialidade)

        setNomeDaEspecialidade(especialidade.nome)
        setCodigo(especialidade.codigo)
        setCategoria(especialidade.categoria)

        setDialogAtualizar(true)
    }

    function abrirConfirmacaoStatus(especialidade: typeof especialidades[number]) {
        setEspecialidadeAtual(especialidade)
        setDialogStatus(true)
    }

    function abrirConfirmacaoExclusao(especialidade: typeof especialidades[number]) {
        setEspecialidadeAtual(especialidade)
        setDialogExcluir(true)
    }



    async function atualizarEspecialidade() {
        if (!especialidadeAtual) return

        try {
            setCarregando(true)

            const resposta = await fetch(`/api/criar-especialidade/${especialidadeAtual.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nomeDaEspecialidade.trim(),
                    codigo: codigo.trim(),
                    categoria,
                }),
            })

            const resultado = await resposta.json()

            if (!resposta.ok) {
                throw new Error(resultado.erro || "Não foi possível atualizar a especialidade.")
            }

            setTituloResultado("Especialidade atualizada!")
            setMensagemResultado("Os dados foram atualizados com sucesso.")

            setDialogAtualizar(false)
            limparFormulario()

            await buscarEspecialidades()

        } catch (erro) {
            setTituloResultado("Erro ao atualizar")
            setMensagemResultado(erro instanceof Error ? erro.message : "Ocorreu um erro inesperado.")
        } finally {
            setCarregando(false)
            setEspecialidadeAtual(null)
            setDialogResultado(true)
        }
    }

    async function alterarStatusEspecialidade() {
        if (!especialidadeAtual) return

        try {
            setCarregando(true)

            const resposta = await fetch(`/api/criar-especialidade/${especialidadeAtual.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ativo: !especialidadeAtual.ativo,
                }),
            })

            const resultado = await resposta.json()

            if (!resposta.ok) {
                throw new Error(resultado.erro || "Não foi possível alterar o status.")
            }

            await buscarEspecialidades()

            setTituloResultado("Status atualizado!")
            setMensagemResultado(
                `A especialidade foi ${resultado.ativo ? "ativada" : "inativada"} com sucesso.`
            )

        } catch (erro) {
            setTituloResultado("Erro ao atualizar status")
            setMensagemResultado(erro instanceof Error ? erro.message : "Ocorreu um erro inesperado.")
        } finally {
            setCarregando(false)
            setDialogStatus(false)
            setEspecialidadeAtual(null)
            setDialogResultado(true)
        }
    }

    return (
        <Template>
            <div className="p-4 text-verde-escuro flex flex-col gap-4 max-h-[100vh] overflow-y-scroll">
                <div className="flex items-center gap-2">
                    <div className="font-bold text-5xl">
                        <LuAmbulance />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl">Criar Especialidade</h3>
                        <p>Gerecie as especialidades cadastradas no sistema.</p>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <form className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                            <InputTexto icone={<TbAmbulance />} id="nomeDaEspecialidade" label="Nome da especialidade" nome="nomeDeEspecialidade" placeholder="Digite o nome da especialidade..." setValor={setNomeDaEspecialidade} valor={nomeDaEspecialidade} />
                            <div className="grid grid-cols-4 gap-4">
                                <InputTexto icone={<TbAmbulance />} id="codigo" label="Código" nome="codigo" placeholder="Digite ou gere um código de 3 dígitos" setValor={setCodigo} valor={codigo} estiloPersonalizado="col-span-3" />
                                <button type="button" className="rounded-lg border border-verde h-[43px] mt-auto" onClick={() => setCodigo(criarCodigoTresDigitos())}>
                                    <p>Gerar Cógigo</p>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            <button
                                type="button"
                                onClick={() => {
                                    limparFormulario()
                                }}
                                className="flex items-center gap-2 font-bold rounded-lg border border-red-600 text-red-600 p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-red-600"

                            >
                                <AiOutlineClear className="text-2xl" />
                                <p>Limpar</p>
                            </button>
                            <button
                                type="submit"
                                disabled={carregando}
                                className="flex items-center gap-2 font-bold rounded-lg border border-verde p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-verde disabled:opacity-50"
                            >
                                <HiSaveAs className="text-2xl" />
                                <p>{carregando ? "Salvando..." : "Salvar"}</p>
                            </button>
                        </div>
                    </form>

                    <div className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4 min-w-0">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <FaList />
                            <h2>Especialidades já cadastradas</h2>
                        </div>
                        {/* <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="filtroPorNome">Buscar por nome do local:</label>
                                <input type="search" name="filtroPorNome" id="filtroPorNome" value={filtroPorNome} onChange={(e) => setFiltroPorNome(e.target.value)} className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] p-2 rounded-lg text-lg transition-all duration-200 focus:outline-verde h-[35px]" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="filtroPorCidade">Buscar por cidade:</label>
                                <input type="search" name="filtroPorCidade" id="filtroPorCidade" value={filtroPorCidade} onChange={(e) => setFiltroPorCidade(e.target.value)} className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] p-2 rounded-lg text-lg transition-all duration-200 focus:outline-verde h-[35px]" />
                            </div>
                        </div> */}
                        <div className="w-full min-w-0 max-w-full overflow-x-auto">
                            <table className="w-[760px] table-fixed border-collapse text-left xl:w-full">
                                <thead>
                                    <tr className="border-b-2 border-verde-escuro">
                                        <th className="w-[250px] p-2 lg:w-full">Nome da Especialidade</th>
                                        <th className="w-[200px] p-2">Código</th>
                                        <th className="w-[200px] p-2">Categoria</th>
                                        <th className="w-[110px] p-2">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {especialidadesPaginadas.length > 0 ? (
                                        especialidadesPaginadas.map((especialidade) => (
                                            <tr key={especialidade.id} className="border-b border-gray-300">
                                                <td className="p-2">{especialidade.nome}</td>
                                                <td className="p-2">{especialidade.codigo}</td>
                                                <td className="p-2">{especialidade.categoria.map(cat => `${cat}, `)}</td>

                                                <td className="p-2 break-words grid grid-cols-2 gap-3 gap-y-1 mt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => abrirEdicao(especialidade)}
                                                        className="rounded-lg border h-7 w-11 border-amber-600 flex justify-center items-center text-amber-600 hover:bg-amber-600 hover:text-white"
                                                        title="Editar"
                                                    >
                                                        <FiEdit />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => abrirConfirmacaoStatus(especialidade)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${especialidade.ativo ? "bg-green-600" : "bg-gray-300"
                                                            }`}
                                                        aria-label={especialidade.ativo ? "Inativar especialidade" : "Ativar especialidade"}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${especialidade.ativo ? "translate-x-6" : "translate-x-1"
                                                                }`}
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => abrirConfirmacaoExclusao(especialidade)}
                                                        className="rounded-lg border h-7 w-11 border-red-600 flex justify-center items-center text-red-600 hover:bg-red-600 hover:text-white"
                                                        title="Excluir"
                                                    >
                                                        <FaRegTrashAlt />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center">
                                                Nenhuma especialidade cadastrada.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                                <div className="w-full flex justify-center items-center">
                                    {especialidades.length > 0 && (
                                        <Paginator
                                            first={first}
                                            rows={rows}
                                            totalRecords={especialidades.length}
                                            rowsPerPageOptions={[5, 10, 15, 20]}
                                            onPageChange={aoMudarPagina}
                                            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                            className="mt-4"
                                        />
                                    )}
                                </div>
                        </div>
                    </div>
                </div>
                {/* Dialog Salvar Local */}
                <DialogPersonalizado
                    visivel={dialogConfirmacao}
                    titulo="Confirmar cadastro de especialidade"
                    mensagem={`Deseja realmente adicionar a especialidade "${nomeDaEspecialidade}"?`}
                    textoConfirmar="Confirmar"
                    textoCancelar="Cancelar"
                    mostrarCancelar={true}
                    aoConfirmar={cadastrarEspecialidade}
                    aoCancelar={cancelarCadastro}
                />

                {/* Dialog de resultado */}
                <DialogPersonalizado
                    visivel={dialogResultado}
                    titulo={tituloResultado}
                    mensagem={mensagemResultado}
                    textoConfirmar="Entendi"
                    aoConfirmar={() => setDialogResultado(false)}
                    aoCancelar={() => setDialogResultado(false)}
                />


                {/* Dialog de edição da especialidade */}
                <Dialog
                    header="Editar especialidade"
                    visible={dialogAtualizar}
                    onHide={() => {
                        setDialogAtualizar(false)
                        setEspecialidadeAtual(null)
                    }}
                    modal
                    className="w-[90vw] md:w-[500px]"
                    draggable={false}
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            atualizarEspecialidade()
                        }}
                        className="flex flex-col gap-4"
                    >
                        <InputTexto
                            icone={<TbAmbulance />}
                            id="nomeEspecialidadeEdicao"
                            label="Nome da especialidade"
                            nome="nomeEspecialidadeEdicao"
                            placeholder="Digite o nome da especialidade..."
                            setValor={setNomeDaEspecialidade}
                            valor={nomeDaEspecialidade}
                        />

                        <InputTexto
                            icone={<TbAmbulance />}
                            id="codigoEspecialidadeEdicao"
                            label="Código"
                            nome="codigoEspecialidadeEdicao"
                            placeholder="Digite o código..."
                            setValor={setCodigo}
                            valor={codigo}
                        />

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setDialogAtualizar(false)
                                    setEspecialidadeAtual(null)
                                    limparFormulario()
                                }}
                                className="rounded-lg border border-red-600 text-red-600 px-4 py-2 font-bold hover:bg-red-600 hover:text-white transition-all"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={carregando}
                                className="rounded-lg border border-verde bg-verde text-white px-4 py-2 font-bold hover:opacity-80 disabled:opacity-50"
                            >
                                {carregando ? "Salvando..." : "Salvar alterações"}
                            </button>
                        </div>
                    </form>
                </Dialog>

                <DialogPersonalizado
                    visivel={dialogStatus}
                    titulo="Confirmar alteração de status"
                    mensagem={`Deseja realmente ${especialidadeAtual?.ativo ? "inativar" : "ativar"} a especialidade "${especialidadeAtual?.nome}"?`}
                    textoConfirmar="Confirmar"
                    textoCancelar="Cancelar"
                    mostrarCancelar={true}
                    aoConfirmar={alterarStatusEspecialidade}
                    aoCancelar={() => {
                        setDialogStatus(false)
                        setEspecialidadeAtual(null)
                    }}
                />
            </div>
        </Template>
    )
}