'use client'

import { LiaProceduresSolid } from "react-icons/lia"
import Template from "../Template"
import { useState } from "react"
import InputTexto from "@/components/inputs/InputTexto"
import { TbAmbulance } from "react-icons/tb"
import InputCheckbox from "@/components/inputs/InputCheckbox"
import { Lateralidade, TipoProcedimento } from "@/generated/prisma/enums"
import { AiOutlineClear } from "react-icons/ai"
import { HiSaveAs } from "react-icons/hi"
import { useProcedimentos } from "@/hooks/useProcedimentos"
import DialogPersonalizado from "@/components/dialog/DialogPersonalizado"
import { Dialog } from "primereact/dialog"
import { FaList, FaRegTrashAlt } from "react-icons/fa"
import { FiEdit } from "react-icons/fi"
import { criarCodigoTresDigitos } from "@/utils/criarCodigoTresDigitos"

export default function Page() {
    const { procedimentos, buscarProcedimentos } = useProcedimentos()

    const [nomeProcedimento, setNomeProcedimento] = useState('')
    const [codigo, setCodigo] = useState('')
    const [inputNomeDoMembro, setInputNomeDoMembro] = useState('')

    const [tipoProcedimento, setTipoProcedimento] = useState<TipoProcedimento>(TipoProcedimento.COMUM)

    const [listaDeMembros, setListaDeMembros] = useState<{
        nome: string
        lateralidade: Lateralidade
    }[]>([])

    const [membroComLado, setMembroComLado] = useState(false)
    const [carregando, setCarregando] = useState(false)


    const [tituloResultado, setTituloResultado] = useState("")
    const [mensagemResultado, setMensagemResultado] = useState("")

    const [dialogConfirmacao, setDialogConfirmacao] = useState(false)
    const [dialogResultado, setDialogResultado] = useState(false)
    const [dialogAtualizar, setDialogAtualizar] = useState(false)
    const [dialogStatus, setDialogStatus] = useState(false)
    const [dialogExcluir, setDialogExcluir] = useState(false)

    const [procedimentoAtual, setProcedimentoAtual] =
        useState<typeof procedimentos[number] | null>(null)


    function adicionarMembro() {
        const nome = inputNomeDoMembro.trim()

        if (!nome) return

        const novoMembro = {
            nome,
            lateralidade: membroComLado
                ? Lateralidade.COM_LADO
                : Lateralidade.SEM_LADO,
        }

        setListaDeMembros((anterior) => [...anterior, novoMembro])

        setInputNomeDoMembro('')
        setMembroComLado(false)
    }

    function removerMembro(nome: string) {
        setListaDeMembros((anterior) =>
            anterior.filter((membro) => membro.nome !== nome)
        )
    }

    function limparFormulario() {
        setNomeProcedimento("")
        setCodigo("")
        setInputNomeDoMembro("")
        setTipoProcedimento(TipoProcedimento.COMUM)
        setListaDeMembros([])
        setMembroComLado(false)
    }

    async function cadastrarProcedimento() {
        setDialogConfirmacao(false)

        try {
            setCarregando(true)

            const resposta = await fetch("/api/criar-procedimento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nomeProcedimento.trim(),
                    codigo: codigo.trim(),
                    tipo: tipoProcedimento,
                    membros: tipoProcedimento === TipoProcedimento.COM_MEMBROS
                        ? listaDeMembros
                        : [],
                }),
            })

            const resultado = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro || "Não foi possível cadastrar o procedimento."
                )
            }

            setTituloResultado("Cadastro realizado!")
            setMensagemResultado("Procedimento cadastrado com sucesso.")

            limparFormulario()
            await buscarProcedimentos()

        } catch (erro) {
            console.error("Erro ao cadastrar procedimento:", erro)

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

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!nomeProcedimento.trim() || !codigo.trim()) {
            setTituloResultado("Campos obrigatórios")
            setMensagemResultado("Preencha o nome e o código do procedimento.")
            setDialogResultado(true)
            return
        }

        if (
            tipoProcedimento === TipoProcedimento.COM_MEMBROS &&
            listaDeMembros.length === 0
        ) {
            setTituloResultado("Membros obrigatórios")
            setMensagemResultado("Adicione pelo menos um membro ao procedimento.")
            setDialogResultado(true)
            return
        }

        setDialogConfirmacao(true)
    }

    function abrirEdicao(procedimento: typeof procedimentos[number]) {
        setProcedimentoAtual(procedimento)

        setNomeProcedimento(procedimento.nome)
        setCodigo(procedimento.codigo)
        setTipoProcedimento(procedimento.tipo)

        setListaDeMembros(
            procedimento.membros.map((membro) => ({
                nome: membro.nome,
                lateralidade: membro.lateralidade,
            }))
        )

        setDialogAtualizar(true)
    }

    async function atualizarProcedimento() {
        if (!procedimentoAtual) return

        try {
            setCarregando(true)

            const resposta = await fetch(
                `/api/criar-procedimento/${procedimentoAtual.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome: nomeProcedimento.trim(),
                        codigo: codigo.trim(),
                        tipo: tipoProcedimento,
                        membros: tipoProcedimento === TipoProcedimento.COM_MEMBROS
                            ? listaDeMembros
                            : [],
                    }),
                }
            )

            const resultado = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro || "Não foi possível atualizar o procedimento."
                )
            }

            setTituloResultado("Procedimento atualizado!")
            setMensagemResultado("Os dados foram atualizados com sucesso.")

            setDialogAtualizar(false)
            limparFormulario()

            await buscarProcedimentos()

        } catch (erro) {
            setTituloResultado("Erro ao atualizar")
            setMensagemResultado(
                erro instanceof Error
                    ? erro.message
                    : "Ocorreu um erro inesperado."
            )

        } finally {
            setCarregando(false)
            setProcedimentoAtual(null)
            setDialogResultado(true)
        }
    }

    function abrirConfirmacaoStatus(
        procedimento: typeof procedimentos[number]
    ) {
        setProcedimentoAtual(procedimento)
        setDialogStatus(true)
    }

    async function alterarStatusProcedimento() {
        if (!procedimentoAtual) return

        try {
            setCarregando(true)

            const resposta = await fetch(
                `/api/criar-procedimento/${procedimentoAtual.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ativo: !procedimentoAtual.ativo,
                    }),
                }
            )

            const resultado = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro || "Não foi possível alterar o status."
                )
            }

            await buscarProcedimentos()

            setTituloResultado("Status atualizado!")
            setMensagemResultado(
                `O procedimento foi ${resultado.ativo ? "ativado" : "inativado"} com sucesso.`
            )

        } catch (erro) {
            setTituloResultado("Erro ao atualizar status")
            setMensagemResultado(
                erro instanceof Error
                    ? erro.message
                    : "Ocorreu um erro inesperado."
            )

        } finally {
            setCarregando(false)
            setDialogStatus(false)
            setProcedimentoAtual(null)
            setDialogResultado(true)
        }
    }

    return (
        <Template>
            <div className="p-4 text-verde-escuro flex flex-col gap-4 max-h-[100vh] overflow-y-scroll">
                <div className="flex items-center gap-2">
                    <div className="font-bold text-5xl">
                        <LiaProceduresSolid />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl">Criar Procedimento</h3>
                        <p>Gerecie os procedimentos cadastradas no sistema.</p>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <form className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-3">
                                <InputTexto icone={<TbAmbulance />} id="nomeDaEspecialidade" label="Nome da especialidade" nome="nomeDeEspecialidade" placeholder="Digite o nome da especialidade..." setValor={setNomeProcedimento} valor={nomeProcedimento} />
                                <div className="grid grid-cols-4 gap-4">
                                    <InputTexto icone={<TbAmbulance />} id="codigo" label="Código" nome="codigo" placeholder="Digite ou gere um código de 3 dígitos" setValor={setCodigo} valor={codigo} estiloPersonalizado="col-span-3" />
                                    <button type="button" className="rounded-lg border border-verde h-[43px] mt-auto" onClick={() => setCodigo(criarCodigoTresDigitos())}>
                                        <p>Gerar Cógigo</p>
                                    </button>
                                </div>
                            </div>
                            <InputCheckbox
                                id="procedimentoComMembros"
                                label="Procedimento com Membros"
                                nome="procedimentoComMembros"
                                setValor={(valor) => {
                                    setTipoProcedimento(
                                        valor
                                            ? TipoProcedimento.COM_MEMBROS
                                            : TipoProcedimento.COMUM
                                    )

                                    if (!valor) {
                                        setListaDeMembros([])
                                    }
                                }}
                                valor={tipoProcedimento === TipoProcedimento.COM_MEMBROS}
                            />
                            {
                                tipoProcedimento === TipoProcedimento.COM_MEMBROS && (
                                    <div className="col-span-3 flex flex-col gap-3">
                                        <div className="grid grid-cols-3 gap-4 items-end">
                                            <div className="col-span-2">
                                                <InputTexto
                                                    icone={<TbAmbulance />}
                                                    id="inputNomeDoMembro"
                                                    label="Nome do membro"
                                                    nome="inputNomeDoMembro"
                                                    placeholder="Digite o nome do membro"
                                                    setValor={setInputNomeDoMembro}
                                                    valor={inputNomeDoMembro}
                                                />
                                            </div>

                                            <InputCheckbox
                                                id="membroComLado"
                                                label="Possui lateralidade"
                                                nome="membroComLado"
                                                setValor={setMembroComLado}
                                                valor={membroComLado}
                                            />

                                            <button
                                                type="button"
                                                onClick={adicionarMembro}
                                                className="col-span-3 rounded-lg border border-verde p-2 font-bold"
                                            >
                                                Adicionar membro
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {listaDeMembros.map((membro, index) => (
                                                <div
                                                    key={`${membro.nome}-${index}`}
                                                    className="flex items-center justify-between border rounded-lg p-3"
                                                >
                                                    <div>
                                                        <p className="font-bold">{membro.nome}</p>
                                                        <p className="text-sm">
                                                            {membro.lateralidade === Lateralidade.COM_LADO
                                                                ? "Possui Lado"
                                                                : "Não Possui Lado"}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removerMembro(membro.nome)}
                                                        className="text-red-600"
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
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
                    <div className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <FaList />
                            <h2>Procedimentos cadastrados</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[650px] text-left">
                                <thead>
                                    <tr className="border-b-2 border-verde-escuro">
                                        <th className="p-2">Procedimento</th>
                                        <th className="p-2">Código</th>
                                        <th className="p-2">Tipo</th>
                                        <th className="p-2">Membros</th>
                                        <th className="p-2">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {procedimentos.length > 0 ? (
                                        procedimentos.map((procedimento) => (
                                            <tr key={procedimento.id} className="border-b border-gray-300">
                                                <td className="p-2">{procedimento.nome}</td>
                                                <td className="p-2">{procedimento.codigo}</td>
                                                <td className="p-2">
                                                    {procedimento.tipo === TipoProcedimento.COM_MEMBROS
                                                        ? "Com membros"
                                                        : "Comum"}
                                                </td>
                                                <td className="p-2">
                                                    {procedimento.membros.length}
                                                </td>
                                                <td className="p-2">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => abrirEdicao(procedimento)}
                                                            className="rounded-lg border border-amber-600 text-amber-600 p-2"
                                                            title="Editar"
                                                        >
                                                            <FiEdit />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => abrirConfirmacaoStatus(procedimento)}
                                                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${procedimento.ativo
                                                                ? "bg-green-600"
                                                                : "bg-gray-300"
                                                                }`}
                                                            title={procedimento.ativo ? "Inativar" : "Ativar"}
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${procedimento.ativo
                                                                    ? "translate-x-6"
                                                                    : "translate-x-1"
                                                                    }`}
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            // onClick={() => abrirConfirmacaoExclusao(procedimento)}
                                                            className="rounded-lg border border-red-600 text-red-600 p-2"
                                                            title="Excluir"
                                                        >
                                                            <FaRegTrashAlt />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center">
                                                Nenhum procedimento cadastrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <DialogPersonalizado
                visivel={dialogConfirmacao}
                titulo="Confirmar cadastro de procedimento"
                mensagem={`Deseja realmente cadastrar o procedimento "${nomeProcedimento}"?`}
                textoConfirmar="Confirmar"
                textoCancelar="Cancelar"
                mostrarCancelar={true}
                aoConfirmar={cadastrarProcedimento}
                aoCancelar={() => {
                    setDialogConfirmacao(false)
                    setTituloResultado("Cadastro cancelado")
                    setMensagemResultado("Nenhum procedimento foi cadastrado.")
                    setDialogResultado(true)
                }}
            />
            <DialogPersonalizado
                visivel={dialogResultado}
                titulo={tituloResultado}
                mensagem={mensagemResultado}
                textoConfirmar="Entendi"
                aoConfirmar={() => setDialogResultado(false)}
                aoCancelar={() => setDialogResultado(false)}
            />

            <Dialog
                header="Editar procedimento"
                visible={dialogAtualizar}
                onHide={() => {
                    setDialogAtualizar(false)
                    setProcedimentoAtual(null)
                    limparFormulario()
                }}
                modal
                className="w-[90vw] md:w-[600px]"
                draggable={false}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        atualizarProcedimento()
                    }}
                    className="flex flex-col gap-4"
                >
                    <InputTexto
                        icone={<TbAmbulance />}
                        id="nomeProcedimentoEdicao"
                        label="Nome do procedimento"
                        nome="nomeProcedimentoEdicao"
                        placeholder="Digite o nome do procedimento..."
                        setValor={setNomeProcedimento}
                        valor={nomeProcedimento}
                    />

                    <InputTexto
                        icone={<TbAmbulance />}
                        id="codigoProcedimentoEdicao"
                        label="Código"
                        nome="codigoProcedimentoEdicao"
                        placeholder="Digite o código..."
                        setValor={setCodigo}
                        valor={codigo}
                    />

                    <InputCheckbox
                        id="procedimentoComMembrosEdicao"
                        label="Procedimento com Membros"
                        nome="procedimentoComMembrosEdicao"
                        valor={tipoProcedimento === TipoProcedimento.COM_MEMBROS}
                        setValor={(valor) => {
                            setTipoProcedimento(
                                valor
                                    ? TipoProcedimento.COM_MEMBROS
                                    : TipoProcedimento.COMUM
                            )

                            if (!valor) {
                                setListaDeMembros([])
                            }
                        }}
                    />

                    {tipoProcedimento === TipoProcedimento.COM_MEMBROS && (
                        <div className="flex flex-col gap-3">
                            <InputTexto
                                icone={<TbAmbulance />}
                                id="nomeMembroEdicao"
                                label="Nome do membro"
                                nome="nomeMembroEdicao"
                                placeholder="Digite o nome do membro..."
                                setValor={setInputNomeDoMembro}
                                valor={inputNomeDoMembro}
                            />

                            <InputCheckbox
                                id="lateralidadeEdicao"
                                label="Possui lateralidade"
                                nome="lateralidadeEdicao"
                                valor={membroComLado}
                                setValor={setMembroComLado}
                            />

                            <button
                                type="button"
                                onClick={adicionarMembro}
                                className="rounded-lg border border-verde p-2 font-bold"
                            >
                                Adicionar membro
                            </button>

                            {listaDeMembros.map((membro, index) => (
                                <div
                                    key={`${membro.nome}-${index}`}
                                    className="flex items-center justify-between border rounded-lg p-3"
                                >
                                    <div>
                                        <p className="font-bold">{membro.nome}</p>
                                        <p className="text-sm">
                                            {membro.lateralidade === Lateralidade.COM_LADO
                                                ? "Possui lateralidade"
                                                : "Não possui lateralidade"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removerMembro(membro.nome)}
                                        className="text-red-600"
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setDialogAtualizar(false)
                                setProcedimentoAtual(null)
                                limparFormulario()
                            }}
                            className="rounded-lg border border-red-600 text-red-600 px-4 py-2 font-bold"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={carregando}
                            className="rounded-lg border border-verde bg-verde text-white px-4 py-2 font-bold disabled:opacity-50"
                        >
                            {carregando ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </form>
            </Dialog>

            <DialogPersonalizado
                visivel={dialogStatus}
                titulo="Confirmar alteração de status"
                mensagem={`Deseja realmente ${procedimentoAtual?.ativo ? "inativar" : "ativar"} o procedimento "${procedimentoAtual?.nome}"?`}
                textoConfirmar="Confirmar"
                textoCancelar="Cancelar"
                mostrarCancelar={true}
                aoConfirmar={alterarStatusProcedimento}
                aoCancelar={() => {
                    setDialogStatus(false)
                    setProcedimentoAtual(null)
                }}
            />
        </Template>
    )
}

/**
 * nome:Tomografia de membro inferior
 * codigo:452
 * procedimentoComMembros: true
 * listaDeMembros:[
 *  nomeDoMembro:{
 *      membro:braco,
 *      procedimentoComLado: true,
 *  },
 * nomeDoMembro:{
 *  membro:perna,
 *  procedimentoComLado: true
 * }
 * ]
 * 
 */