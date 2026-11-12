'use client'

import { useState } from "react"
import Template from "../Template"
import { RiServiceLine } from "react-icons/ri"
import InputTexto from "@/components/inputs/InputTexto"
import { TbAmbulance, TbListDetails } from "react-icons/tb"
import { FaHandHoldingMedical, FaList, FaRegTrashAlt } from "react-icons/fa"
import { useEspecialidades } from "@/hooks/useEspecialidades"
import { useProcedimentos } from "@/hooks/useProcedimentos"
import { CORES_PRESTADORES } from "@/constants/dados"
import { TipoDoPrestador } from "@/generated/prisma/enums"
import DialogPersonalizado from "@/components/dialog/DialogPersonalizado"
import { PrestadorComRelacoes, usePrestadores } from "@/hooks/usePrestadores"
import { FiEdit } from "react-icons/fi"
import { Dialog } from "primereact/dialog"

export default function Page() {
    const { especialidades } = useEspecialidades()
    const { procedimentos } = useProcedimentos()

    const { prestadores, buscarPrestadores } = usePrestadores()
    console.log(prestadores)
    const [tipo, setTipo] = useState<TipoDoPrestador>(TipoDoPrestador.MEDICO)
    const [nomeDoPrestador, setNomeDoPrestador] = useState('')

    const [buscarEspecialidade, setBuscarEspecialidade] = useState('')
    const [especialidadesSelecionadas, setEspecialidadesSelecionadas] = useState<typeof especialidades>([])

    const especialidadesFiltradas = especialidades.filter((especialidade) =>
        especialidade.nome.toLowerCase().includes(buscarEspecialidade.toLowerCase()) &&
        especialidade.ativo &&
        !especialidadesSelecionadas.some(
            (selecionada) => selecionada.id === especialidade.id
        )
    )

    function adicionarEspecialidade(id: number) {
        const especialidade = especialidades.find(
            (item) => item.id === id
        )
        if (!especialidade) return
        setEspecialidadesSelecionadas((anterior) => [
            ...anterior,
            especialidade,
        ])
        setBuscarEspecialidade('')
    }

    function removerEspecialidade(id: number) {
        setEspecialidadesSelecionadas((anterior) =>
            anterior.filter((item) => item.id !== id)
        )
    }


    const [buscarProcedimento, setBuscarProcedimento] = useState('')
    const [procedimentosSelecionados, setProcedimentosSelecionados] =
        useState<typeof procedimentos>([])

    const [telefone, setTelefone] = useState('')
    const [email, setEmail] = useState('')
    const [observacoes, setObservacoes] = useState('')
    const [corSelecionada, setCorSelecionada] = useState('')


    const procedimentosFiltrados = procedimentos.filter((procedimento) =>
        procedimento.nome.toLowerCase().includes(buscarProcedimento.toLowerCase()) &&
        procedimento.ativo &&
        !procedimentosSelecionados.some(
            (selecionado) => selecionado.id === procedimento.id
        )
    )

    function adicionarProcedimento(id: number) {
        const procedimento = procedimentos.find(
            (item) => item.id === id
        )

        if (!procedimento) return

        setProcedimentosSelecionados((anterior) => [
            ...anterior,
            procedimento,
        ])

        setBuscarProcedimento('')
    }

    function removerProcedimento(id: number) {
        setProcedimentosSelecionados((anterior) =>
            anterior.filter((item) => item.id !== id)
        )
    }


    // Dialogs
    const [tituloResultado, setTituloResultado] = useState("");
    const [mensagemResultado, setMensagemResultado] = useState("");

    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
    const [dialogResultado, setDialogResultado] = useState(false);

    const [prestadorSelecionado, setPrestadorSelecionado] = useState<PrestadorComRelacoes | null>(null)

    const [dialogConfirmacaoStatus, setDialogConfirmacaoStatus] = useState(false)
    const [dialogConfirmacaoExclusao, setDialogConfirmacaoExclusao] = useState(false)
    const [dialogEdicao, setDialogEdicao] = useState(false)
    const [dialogDetalhes, setDialogDetalhes] = useState(false)


    const [nomeEdicao, setNomeEdicao] = useState("")
    const [corEdicao, setCorEdicao] = useState("")
    const [especialidadesEdicao, setEspecialidadesEdicao] = useState<number[]>([])
    const [procedimentosEdicao, setProcedimentosEdicao] = useState<number[]>([])

    const [buscarEspecialidadeEdicao, setBuscarEspecialidadeEdicao] = useState("")
    const [buscarProcedimentoEdicao, setBuscarProcedimentoEdicao] = useState("")

    async function cadastrarPrestador() {
        setDialogConfirmacao(false)

        try {
            const resposta = await fetch("/api/criar-prestador", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nomeDoPrestador.trim(),
                    tipo,
                    cor: corSelecionada,
                    telefone: telefone,
                    email: email,
                    especialidadesIds:
                        tipo === "MEDICO"
                            ? especialidadesSelecionadas.map((item) => item.id)
                            : [],

                    procedimentosIds:
                        tipo === "PRESTADOR_DE_SERVICOS_MEDICOS"
                            ? procedimentosSelecionados.map((item) => item.id)
                            : [],
                }),
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                throw new Error(dados.erro || "Erro ao cadastrar prestador.")
            }

            await buscarPrestadores()

            setTituloResultado("Cadastro realizado!")
            setMensagemResultado("O prestador foi cadastrado com sucesso.")

            limparFormulario()

        } catch (erro) {
            console.error("Erro ao cadastrar prestador:", erro)

            setTituloResultado("Erro no cadastro")
            setMensagemResultado(
                erro instanceof Error
                    ? erro.message
                    : "Não foi possível cadastrar o prestador."
            )
        }

        setDialogResultado(true)
    }

    function handleConfirmarCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!nomeDoPrestador.trim()) {
            setTituloResultado("Atenção")
            setMensagemResultado("Informe o nome do prestador.")
            setDialogResultado(true)
            return
        }

        if (!corSelecionada) {
            setTituloResultado("Atenção")
            setMensagemResultado("Selecione uma cor para o prestador.")
            setDialogResultado(true)
            return
        }

        if (
            tipo === "MEDICO" &&
            especialidadesSelecionadas.length === 0
        ) {
            setTituloResultado("Atenção")
            setMensagemResultado("Selecione pelo menos uma especialidade.")
            setDialogResultado(true)
            return
        }

        if (
            tipo === "PRESTADOR_DE_SERVICOS_MEDICOS" &&
            procedimentosSelecionados.length === 0
        ) {
            setTituloResultado("Atenção")
            setMensagemResultado("Selecione pelo menos um procedimento.")
            setDialogResultado(true)
            return
        }

        if (corEstaEmUso(corSelecionada)) {
            setTituloResultado("Cor indisponível")
            setMensagemResultado(
                "Essa cor já está sendo utilizada por outro prestador. Selecione outra cor."
            )
            setDialogResultado(true)
            return
        }

        setDialogConfirmacao(true)
    }


    function abrirEdicao(prestador: PrestadorComRelacoes) {
        setPrestadorSelecionado(prestador)

        setNomeEdicao(prestador.nome)
        setCorEdicao(prestador.cor)
        setTelefone(prestador.telefone)
        setEmail(prestador.email)
        // setObservacoes(prestador)

        setEspecialidadesEdicao(
            prestador.especialidades.map((item) => item.especialidadeId)
        )

        setProcedimentosEdicao(
            prestador.procedimentos.map((item) => item.procedimentoId)
        )

        setDialogEdicao(true)
    }

    function abrirConfirmacaoStatus(prestador: PrestadorComRelacoes) {
        setPrestadorSelecionado(prestador)
        setDialogConfirmacaoStatus(true)
    }

    function abrirConfirmacaoExclusao(prestador: PrestadorComRelacoes) {
        setPrestadorSelecionado(prestador)
        setDialogConfirmacaoExclusao(true)
    }

    function abrirDetalhes(prestador: PrestadorComRelacoes) {
        setPrestadorSelecionado(prestador)
        setDialogDetalhes(true)
    }

    async function alterarStatusPrestador() {
        if (!prestadorSelecionado) return

        try {
            const resposta = await fetch(
                `/api/criar-prestador/${prestadorSelecionado.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ativo: !prestadorSelecionado.ativo,
                    }),
                }
            )

            const dados = await resposta.json()

            if (!resposta.ok) {
                throw new Error(dados.erro || "Erro ao alterar status.")
            }

            setDialogConfirmacaoStatus(false)

            setTituloResultado("Status atualizado!")
            setMensagemResultado(
                `O prestador foi ${dados.ativo ? "ativado" : "inativado"} com sucesso.`
            )

            await buscarPrestadores()
        } catch (erro) {
            setDialogConfirmacaoStatus(false)
            setTituloResultado("Erro")
            setMensagemResultado(
                erro instanceof Error ? erro.message : "Não foi possível alterar o status."
            )
        }

        setDialogResultado(true)
    }

    async function editarPrestador() {
        if (!prestadorSelecionado) return

        try {
            const resposta = await fetch(
                `/api/criar-prestador/${prestadorSelecionado.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome: nomeEdicao.trim(),
                        cor: corEdicao,

                        especialidadesIds:
                            prestadorSelecionado.tipo === "MEDICO"
                                ? especialidadesEdicao
                                : [],

                        procedimentosIds:
                            prestadorSelecionado.tipo === "PRESTADOR_DE_SERVICOS_MEDICOS"
                                ? procedimentosEdicao
                                : [],
                    }),
                }
            )

            const dados = await resposta.json()

            if (!resposta.ok) {
                throw new Error(dados.erro || "Erro ao editar prestador.")
            }

            setDialogEdicao(false)

            setTituloResultado("Cadastro atualizado!")
            setMensagemResultado("Os dados do prestador foram atualizados com sucesso.")
            limparFormulario()

            await buscarPrestadores()
        } catch (erro) {
            setDialogEdicao(false)
            setTituloResultado("Erro na edição")
            setMensagemResultado(
                erro instanceof Error ? erro.message : "Não foi possível editar o prestador."
            )
        }

        setDialogResultado(true)
    }

    function limparFormulario() {
        setNomeDoPrestador("")
        setTelefone("")
        setEmail("")
        setObservacoes("")
        setEspecialidadesSelecionadas([])
        setProcedimentosSelecionados([])
        setCorSelecionada("")
    }

    function corEstaEmUso(
        cor: string,
        ignorarPrestadorId?: PrestadorComRelacoes["id"]
    ) {
        return prestadores.some(
            (prestador) =>
                prestador.cor.toUpperCase() === cor.toUpperCase() &&
                prestador.id !== ignorarPrestadorId
        )
    }

    return (
        <Template>
            <div className="p-4 text-verde-escuro flex flex-col gap-4 max-h-[100vh] overflow-y-scroll">
                <div className="flex items-center gap-2">
                    <div className="font-bold text-5xl">
                        <RiServiceLine />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl">Criar Prestador</h3>
                        <p>Gerecie os prestadores Médicos e prestadores de Serviços Médicos cadastrados no sistema.</p>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <form className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4" onSubmit={handleConfirmarCadastro}>
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className={`border border-verde-escuro rounded-lg py-1 shadow-[0px_0px_2px_1px_var(--verde-escuro)] ${tipo === TipoDoPrestador.MEDICO ? 'bg-verde-escuro text-white' : ''}`} onClick={() => setTipo(TipoDoPrestador.MEDICO)}>
                                <p>Médico</p>
                            </button>
                            <button type="button" className={`border border-verde-escuro rounded-lg py-1 shadow-[0px_0px_2px_1px_var(--verde-escuro)] ${tipo === TipoDoPrestador.PRESTADOR_DE_SERVICOS_MEDICOS ? 'bg-verde-escuro text-white' : ''}`} onClick={() => setTipo(TipoDoPrestador.PRESTADOR_DE_SERVICOS_MEDICOS)}>
                                <p>Prestador de Serviços Médicos</p>
                            </button>
                        </div>
                        <InputTexto icone={<TbAmbulance />} id="nomeDoPrestador" label="Nome da prestador" nome="nomeDoPrestador" placeholder="Digite o nome do prestador..." setValor={setNomeDoPrestador} valor={nomeDoPrestador} />

                        {
                            tipo === TipoDoPrestador.MEDICO ? (
                                <div className="flex flex-col gap-3">
                                    <label
                                        htmlFor="especialidades"
                                        className="flex items-center gap-2 text-xl font-bold"
                                    >
                                        <FaHandHoldingMedical className="text-3xl" />
                                        <h3>Especialidades</h3>
                                    </label>

                                    <input
                                        id="especialidades"
                                        type="text"
                                        value={buscarEspecialidade}
                                        onChange={(e) => setBuscarEspecialidade(e.target.value)}
                                        placeholder="Digite o nome da especialidade..."
                                        autoComplete="off"
                                        className="w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-verde focus:ring-1 focus:ring-verde"
                                    />

                                    {buscarEspecialidade.trim() && (
                                        <div className="border border-zinc-300 rounded-lg overflow-hidden">
                                            {especialidadesFiltradas.length > 0 ? (
                                                especialidadesFiltradas.map((especialidade) => (
                                                    <button
                                                        key={especialidade.id}
                                                        type="button"
                                                        onClick={() => adicionarEspecialidade(especialidade.id)}
                                                        className="w-full text-left px-3 py-2 hover:bg-verde/10 transition-colors border-b last:border-b-0"
                                                    >
                                                        {especialidade.nome}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="p-3 text-sm text-gray-500">
                                                    Nenhuma especialidade encontrada.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {especialidadesSelecionadas.length > 0 && (
                                        <div className="flex flex-col gap-2">
                                            <p className="font-semibold">
                                                Especialidades selecionadas:
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {especialidadesSelecionadas.map((especialidade) => (
                                                    <div
                                                        key={especialidade.id}
                                                        className="flex items-center gap-2 bg-verde/10 border border-verde rounded-lg px-3 py-2"
                                                    >
                                                        <span>{especialidade.nome}</span>

                                                        <button
                                                            type="button"
                                                            onClick={() => removerEspecialidade(especialidade.id)}
                                                            className="text-red-600 font-bold"
                                                            title="Remover especialidade"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div className="flex flex-col gap-3">
                                        <label
                                            htmlFor="procedimentos"
                                            className="flex items-center gap-2 text-xl font-bold"
                                        >
                                            <FaHandHoldingMedical className="text-3xl" />
                                            <h3>Procedimentos</h3>
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                id="procedimentos"
                                                type="text"
                                                value={buscarProcedimento}
                                                onChange={(e) => setBuscarProcedimento(e.target.value)}
                                                placeholder="Digite o nome do procedimento..."
                                                autoComplete="off"
                                                className="w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-verde focus:ring-1 focus:ring-verde"
                                            />

                                            {buscarProcedimento.trim() && (
                                                <div className="border border-zinc-300 rounded-lg overflow-hidden">
                                                    {procedimentosFiltrados.length > 0 ? (
                                                        procedimentosFiltrados.map((procedimento) => (
                                                            <button
                                                                key={procedimento.id}
                                                                type="button"
                                                                onClick={() => adicionarProcedimento(procedimento.id)}
                                                                className="w-full text-left px-3 py-2 hover:bg-verde/10 transition-colors border-b last:border-b-0"
                                                            >
                                                                <p className="font-semibold">{procedimento.nome}</p>

                                                                {procedimento.tipo === 'COM_MEMBROS' && (
                                                                    <p className="text-sm text-gray-500">
                                                                        {procedimento.membros.length} membro(s)
                                                                    </p>
                                                                )}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <p className="p-3 text-sm text-gray-500">
                                                            Nenhum procedimento encontrado.
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {procedimentosSelecionados.length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <p className="font-semibold">
                                                        Procedimentos selecionados:
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {procedimentosSelecionados.map((procedimento) => (
                                                            <div
                                                                key={procedimento.id}
                                                                className="flex items-center gap-2 bg-verde/10 border border-verde rounded-lg px-3 py-2"
                                                            >
                                                                <div>
                                                                    <p>{procedimento.nome}</p>

                                                                    {procedimento.tipo === 'COM_MEMBROS' && (
                                                                        <p className="text-xs text-gray-500">
                                                                            Com membros
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => removerProcedimento(procedimento.id)}
                                                                    className="text-red-600 font-bold"
                                                                    title="Remover procedimento"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        <InputTexto icone={<TbAmbulance />} id="telefone" label="Telefone" nome="telefone" placeholder="Digite o telefone do prestador..." setValor={setTelefone} valor={telefone} />
                        <InputTexto icone={<TbAmbulance />} id="email" label="email" nome="email" placeholder="Digite o email do prestador..." setValor={setEmail} valor={email} />
                        {/* Alterar para um textarea depois */}
                        <InputTexto icone={<TbAmbulance />} id="observacoes" label="Observações" nome="observacoes" placeholder="Digite o observacoes do prestador..." setValor={setObservacoes} valor={observacoes} />

                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="font-bold text-xl">Cor do prestador</p>
                                <p className="text-sm text-gray-500">
                                    Selecione uma cor para identificar este prestador no sistema.
                                </p>
                            </div>

                            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3 2xl:grid-cols-16 3xl:grid-cols-20">
                                {CORES_PRESTADORES.map((cor) => {
                                    const indisponivel = corEstaEmUso(cor)

                                    return (
                                        <button
                                            key={cor}
                                            type="button"
                                            disabled={indisponivel}
                                            onClick={() => setCorSelecionada(cor)}
                                            title={indisponivel ? `${cor} - Indisponível` : cor}
                                            aria-label={`Selecionar cor ${cor}`}
                                            className={`h-10 w-10 mx-auto rounded-full border-2 transition-all ${indisponivel
                                                ? "opacity-20 cursor-not-allowed"
                                                : corSelecionada === cor
                                                    ? "border-verde-escuro scale-110 ring-2 ring-verde-escuro ring-offset-2"
                                                    : "border-transparent hover:scale-110"
                                                }`}
                                            style={{ backgroundColor: cor }}
                                        />
                                    )
                                })}
                            </div>

                            {corSelecionada && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: corSelecionada }} />
                                    <p className="text-sm">Cor selecionada: <strong>{corSelecionada}</strong></p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                className="rounded-lg border border-red-600 text-red-600 px-4 py-2 font-bold hover:bg-red-600 hover:text-white transition-all"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="rounded-lg border border-verde bg-verde text-white px-4 py-2 font-bold hover:opacity-80 disabled:opacity-50"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                    <div className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4 min-w-0">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <FaList />
                            <h2>Prestadores já cadastradas</h2>
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
                            <table className="w-[900px] table-fixed border-collapse text-left xl:w-full">
                                <thead>
                                    <tr className="border-b-2 border-verde-escuro">
                                        <th className="w-[250px] p-2">Nome do prestador</th>
                                        <th className="w-[180px] p-2">Tipo</th>
                                        <th className="w-[240px] p-2">Especialidade/Procedimento</th>
                                        <th className="w-[120px] p-2">Telefone</th>
                                        <th className="w-[180px] p-2">Email</th>
                                        <th className="w-[120px] p-2">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {prestadores.length > 0 ? (
                                        prestadores.map((prestador) => {
                                            console.log(prestador) // aqui aparece a lista de procedimentos e especialdiades 
                                            return (
                                                <tr key={prestador.id} className="border-b border-gray-300">
                                                    <td className="p-2">{prestador.nome}</td>
                                                    <td className="p-2 capitalize">{prestador.tipo.replaceAll('_', ' ').toLowerCase()}</td>

                                                    <td className="my-auto">
                                                        {
                                                            prestador.especialidades.length > 0 ? (
                                                                <p className="line-clamp-2 text-center my-auto h-full">
                                                                    {
                                                                        prestador.especialidades.length > 0 ? (
                                                                            prestador.especialidades.map((esp, i) => {
                                                                                return (
                                                                                    `${esp.especialidade.nome}${i < prestador.especialidades.length - 1 ? " - " : ""}`
                                                                                )
                                                                            })
                                                                        ) : ''
                                                                    }
                                                                </p>
                                                            ) : (
                                                                <p className="line-clamp-2 text-center my-auto h-full">
                                                                    {
                                                                        prestador.procedimentos.length > 0 ? (
                                                                            prestador.procedimentos.map((esp, i) => {
                                                                                return (
                                                                                    `${esp.procedimento.nome}${i < prestador.procedimentos.length - 1 ? " - " : ""}`
                                                                                )
                                                                            })
                                                                        ) : ''
                                                                    }
                                                                </p>
                                                            )
                                                        }
                                                    </td>
                                                    <td className="p-2">{prestador.telefone}</td>
                                                    <td className="p-2 truncate">{prestador.email}</td>
                                                    <td className="p-2">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => abrirEdicao(prestador)}
                                                                className="rounded-lg border h-7 w-11 border-amber-600 flex justify-center items-center text-amber-600 hover:bg-amber-600 hover:text-white"
                                                                title="Editar"
                                                            >
                                                                <FiEdit />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => abrirConfirmacaoStatus(prestador)}
                                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${prestador.ativo ? "bg-green-600" : "bg-gray-300"
                                                                    }`}
                                                                aria-label={prestador.ativo ? "Inativar prestador" : "Ativar prestador"}
                                                            >
                                                                <span
                                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prestador.ativo ? "translate-x-6" : "translate-x-1"
                                                                        }`}
                                                                />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => abrirConfirmacaoExclusao(prestador)}
                                                                className="rounded-lg border h-7 w-11 border-red-600 flex justify-center items-center text-red-600 hover:bg-red-600 hover:text-white"
                                                                title="Excluir"
                                                            >
                                                                <FaRegTrashAlt />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => abrirDetalhes(prestador)}
                                                                className="rounded-lg border h-7 w-11 border-verde-escuro flex justify-center items-center text-verde-escuro hover:bg-verde-escuro hover:text-white"
                                                                title="Detalhes"
                                                            >
                                                                <TbListDetails />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center">
                                                Nenhuma especialidade cadastrada.
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
                titulo="Confirmar cadastro de prestador"
                mensagem={`Deseja realmente cadastrar o prestador "${nomeDoPrestador}"?`}
                textoConfirmar="Confirmar"
                textoCancelar="Cancelar"
                mostrarCancelar={true}
                aoConfirmar={cadastrarPrestador}
                aoCancelar={() => setDialogConfirmacao(false)}
            />

            <DialogPersonalizado
                visivel={dialogResultado}
                titulo={tituloResultado}
                mensagem={mensagemResultado}
                textoConfirmar="Entendi"
                aoConfirmar={() => setDialogResultado(false)}
                aoCancelar={() => setDialogResultado(false)}
            />


            {/* Dialog de edição do prestador */}
            <Dialog
                header="Editar prestador"
                visible={dialogEdicao}
                onHide={() => {
                    setDialogEdicao(false)
                    setPrestadorSelecionado(null)
                }}
                modal
                className="w-[90vw] md:w-[550px]"
                draggable={false}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        editarPrestador()
                    }}
                    className="flex flex-col gap-4"
                >
                    <InputTexto
                        icone={<RiServiceLine />}
                        id="nomePrestadorEdicao"
                        label="Nome do prestador"
                        nome="nomePrestadorEdicao"
                        placeholder="Digite o nome do prestador..."
                        setValor={setNomeEdicao}
                        valor={nomeEdicao}
                    />

                    <InputTexto icone={<TbAmbulance />} id="telefone" label="Telefone" nome="telefone" placeholder="Digite o telefone do prestador..." setValor={setTelefone} valor={telefone} />
                    <InputTexto icone={<TbAmbulance />} id="email" label="email" nome="email" placeholder="Digite o email do prestador..." setValor={setEmail} valor={email} />
                    {/* Alterar para um textarea depois */}
                    <InputTexto icone={<TbAmbulance />} id="observacoes" label="Observações" nome="observacoes" placeholder="Digite o observacoes do prestador..." setValor={setObservacoes} valor={observacoes} />

                    {/* Seleção de cor */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Cor do prestador</label>

                        <div className="flex flex-wrap gap-3">
                            {CORES_PRESTADORES.map((cor) => {
                                const indisponivel = corEstaEmUso(cor)

                                return (
                                    <button
                                        key={cor}
                                        type="button"
                                        disabled={indisponivel}
                                        onClick={() => setCorSelecionada(cor)}
                                        title={indisponivel ? `${cor} - Indisponível` : cor}
                                        aria-label={`Selecionar cor ${cor}`}
                                        className={`h-10 w-10 mx-auto rounded-full border-2 transition-all ${indisponivel
                                                ? "opacity-20 cursor-not-allowed"
                                                : corSelecionada === cor
                                                    ? "border-verde-escuro scale-110 ring-2 ring-verde-escuro ring-offset-2"
                                                    : "border-transparent hover:scale-110"
                                            }`}
                                        style={{ backgroundColor: cor }}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* Especialidades do médico */}
                    {prestadorSelecionado?.tipo === "MEDICO" && (
                        <div className="flex flex-col gap-3">
                            <label className="font-semibold">
                                Especialidades
                            </label>

                            {/* Especialidades selecionadas */}
                            <div className="flex flex-wrap gap-2">
                                {especialidadesEdicao.map((id) => {
                                    const especialidade = especialidades.find(
                                        (item) => item.id === id
                                    )

                                    if (!especialidade) return null

                                    return (
                                        <div
                                            key={id}
                                            className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm"
                                        >
                                            <span>{especialidade.nome}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEspecialidadesEdicao((anterior) =>
                                                        anterior.filter((item) => item !== id)
                                                    )
                                                }
                                                className="hover:text-red-600 font-bold"
                                                title="Remover especialidade"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )
                                })}

                                {especialidadesEdicao.length === 0 && (
                                    <span className="text-sm text-gray-500">
                                        Nenhuma especialidade selecionada.
                                    </span>
                                )}
                            </div>

                            {/* Campo para adicionar especialidades */}
                            <input
                                type="text"
                                value={buscarEspecialidadeEdicao}
                                onChange={(e) =>
                                    setBuscarEspecialidadeEdicao(e.target.value)
                                }
                                placeholder="Pesquisar especialidade..."
                                className="w-full border rounded-lg p-3 outline-verde"
                            />

                            {/* Resultados da pesquisa */}
                            {buscarEspecialidadeEdicao.trim() !== "" && (
                                <div className="border rounded-lg max-h-40 overflow-y-auto">
                                    {especialidades
                                        .filter(
                                            (item) =>
                                                item.ativo &&
                                                item.nome
                                                    .toLowerCase()
                                                    .includes(buscarEspecialidadeEdicao.toLowerCase()) &&
                                                !especialidadesEdicao.includes(item.id)
                                        )
                                        .map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => {
                                                    setEspecialidadesEdicao((anterior) => [
                                                        ...anterior,
                                                        item.id,
                                                    ])
                                                    setBuscarEspecialidadeEdicao("")
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                                            >
                                                {item.nome}
                                                <span className="float-right text-green-600">
                                                    +
                                                </span>
                                            </button>
                                        ))}

                                    {especialidades.filter(
                                        (item) =>
                                            item.ativo &&
                                            item.nome
                                                .toLowerCase()
                                                .includes(buscarEspecialidadeEdicao.toLowerCase()) &&
                                            !especialidadesEdicao.includes(item.id)
                                    ).length === 0 && (
                                            <p className="p-3 text-sm text-gray-500">
                                                Nenhuma especialidade encontrada.
                                            </p>
                                        )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Procedimentos do prestador de serviços médicos */}
                    {prestadorSelecionado?.tipo === "PRESTADOR_DE_SERVICOS_MEDICOS" && (
                        <div className="flex flex-col gap-3">
                            <label className="font-semibold">
                                Procedimentos
                            </label>

                            {/* Procedimentos selecionados */}
                            <div className="flex flex-wrap gap-2">
                                {procedimentosEdicao.map((id) => {
                                    const procedimento = procedimentos.find(
                                        (item) => item.id === id
                                    )

                                    if (!procedimento) return null

                                    return (
                                        <div
                                            key={id}
                                            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm"
                                        >
                                            <span>{procedimento.nome}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setProcedimentosEdicao((anterior) =>
                                                        anterior.filter((item) => item !== id)
                                                    )
                                                }
                                                className="hover:text-red-600 font-bold"
                                                title="Remover procedimento"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )
                                })}

                                {procedimentosEdicao.length === 0 && (
                                    <span className="text-sm text-gray-500">
                                        Nenhum procedimento selecionado.
                                    </span>
                                )}
                            </div>

                            {/* Campo para adicionar procedimentos */}
                            <input
                                type="text"
                                value={buscarProcedimentoEdicao}
                                onChange={(e) =>
                                    setBuscarProcedimentoEdicao(e.target.value)
                                }
                                placeholder="Pesquisar procedimento..."
                                className="w-full border rounded-lg p-3 outline-verde"
                            />

                            {/* Resultados da pesquisa */}
                            {buscarProcedimentoEdicao.trim() !== "" && (
                                <div className="border rounded-lg max-h-40 overflow-y-auto">
                                    {procedimentos
                                        .filter(
                                            (item) =>
                                                item.ativo &&
                                                item.nome
                                                    .toLowerCase()
                                                    .includes(buscarProcedimentoEdicao.toLowerCase()) &&
                                                !procedimentosEdicao.includes(item.id)
                                        )
                                        .map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => {
                                                    setProcedimentosEdicao((anterior) => [
                                                        ...anterior,
                                                        item.id,
                                                    ])
                                                    setBuscarProcedimentoEdicao("")
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                                            >
                                                {item.nome}
                                                <span className="float-right text-blue-600">
                                                    +
                                                </span>
                                            </button>
                                        ))}

                                    {procedimentos.filter(
                                        (item) =>
                                            item.ativo &&
                                            item.nome
                                                .toLowerCase()
                                                .includes(buscarProcedimentoEdicao.toLowerCase()) &&
                                            !procedimentosEdicao.includes(item.id)
                                    ).length === 0 && (
                                            <p className="p-3 text-sm text-gray-500">
                                                Nenhum procedimento encontrado.
                                            </p>
                                        )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setDialogEdicao(false)
                                setPrestadorSelecionado(null)
                            }}
                            className="rounded-lg border border-red-600 text-red-600 px-4 py-2 font-bold hover:bg-red-600 hover:text-white transition-all"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg border border-verde bg-verde text-white px-4 py-2 font-bold hover:opacity-80 disabled:opacity-50"
                        >
                            Salvar alterações
                        </button>
                    </div>
                </form>
            </Dialog>


            <DialogPersonalizado
                visivel={dialogConfirmacaoStatus}
                titulo="Confirmar alteração de status"
                mensagem={`Deseja realmente ${prestadorSelecionado?.ativo ? "inativar" : "ativar"} o prestador "${prestadorSelecionado?.nome}"?`}
                textoConfirmar="Confirmar"
                textoCancelar="Cancelar"
                mostrarCancelar={true}
                aoConfirmar={alterarStatusPrestador}
                aoCancelar={() => setDialogConfirmacaoStatus(false)}
            />


            <DialogPersonalizado
                visivel={dialogResultado}
                titulo={tituloResultado}
                mensagem={mensagemResultado}
                textoConfirmar="Entendi"
                aoConfirmar={() => setDialogResultado(false)}
                aoCancelar={() => setDialogResultado(false)}
            />
        </Template>
    )
}