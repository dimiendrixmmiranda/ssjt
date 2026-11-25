'use client'
import { FaFileMedicalAlt, FaHandHoldingMedical, FaPlus, FaSourcetree } from "react-icons/fa";
import Template from "../Template";
import { FaClockRotateLeft, FaListCheck, FaUserPen } from "react-icons/fa6";
import { usePacientes } from "@/hooks/usePacientes";
import { useRef, useState } from "react";
import { TbFilterCog, TbPhoneCalling, TbUrgent } from "react-icons/tb";
import InputSelect from "@/components/inputs/InputSelect";
import { AiOutlineSelect } from "react-icons/ai";
import InputTexto from "@/components/inputs/InputTexto";
import { MdCopyAll, MdDriveFileRenameOutline, MdOutlineMedicalInformation, MdTableRows } from "react-icons/md";
import { normalizarTexto, opcoesCampoDeBusca, opcoesCategoriaDaConsulta, opcoesDeLocais, opcoesLadoDoCorpo, opcoesPossibilidadeDeRetorno, opcoesSituacaoDeEncaminhamento, opcoesStatusDeAgendamento, opcoesTipoDeConsulta } from "@/constants/dados";
import { CampoDeBusca, StatusDeAgendamento } from "@/generated/prisma/enums";
import { useLocais } from "@/hooks/useListaDeLocais";
import { Dialog } from "primereact/dialog";
import { Local, Paciente, Prestador } from "@/generated/prisma/client";
import { LiaProceduresSolid } from "react-icons/lia";
import InputData from "@/components/inputs/InputData";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { usePrestadores } from "@/hooks/usePrestadores";
import { useEspecialidades } from "@/hooks/useEspecialidades";

import type { CategoriaEspecialidade, Especialidade, Prisma } from "@/generated/prisma/client"
import { IoMapSharp } from "react-icons/io5";
import InputCheckbox from "@/components/inputs/InputCheckbox";
import { useProcedimentos } from "@/hooks/useProcedimentos";
import DialogPersonalizado from "@/components/dialog/DialogPersonalizado";
import { useEncaminhamentos } from "@/hooks/useEncaminhamentos";
import Image from "next/image";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { RxRows } from "react-icons/rx";
import { LuMinus } from "react-icons/lu";
import MenuContextoPaciente from "@/components/contextoDeAtendimento/ContextoDeAtendimento";
import FormIncluirAgendamento from "@/components/formularios/FormularioIncluirAgendamento";
import DocumentoRequisicaoProcedimentos from "@/components/pdf/requisicoes/procedimentos/DocumentoRequisicaoDeProcedimentos";
import { pdf } from "@react-pdf/renderer"
import { gerarCodigoDeBarras } from "@/utils/gerarCodigoDeBarras";
import DocumentoRequisicaoConsultas from "@/components/pdf/requisicoes/consultas/DocumentoRequisicaoDeConsultas";

type AcaoPaciente =
    | "agendamento"
    | "alterar"
    | "bloquear"
    | "desbloquear"
    | "contato"
    | "historico"
    | "comprovanteEntrada"
    | "comprovanteAgendamento"
    | "requisicaoExames"
    | "cadsus"
    | "prioridade"
    | "visualizar"

export type PrestadorComRelacoes = Prisma.PrestadorGetPayload<{
    include: {
        especialidades: {
            include: {
                especialidade: true
            }
        }
        procedimentos: {
            include: {
                procedimento: true
            }
        }
    }
}>


export default function Page() {
    const { pacientes } = usePacientes()
    const { locais } = useLocais()
    const { prestadores } = usePrestadores()
    const { especialidades } = useEspecialidades()
    const { procedimentos } = useProcedimentos()
    const { encaminhamentos, carregandoEncaminhamentos, buscarEncaminhamentos } = useEncaminhamentos()

    const tabelaRef = useRef<HTMLDivElement>(null);
    const arrastando = useRef(false)
    const posicaoInicialX = useRef(0)
    const scrollInicial = useRef(0)

    const iniciarArraste = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!tabelaRef.current) return

        arrastando.current = true
        posicaoInicialX.current = e.clientX
        scrollInicial.current = tabelaRef.current.scrollLeft

        tabelaRef.current.style.cursor = "grabbing"
        tabelaRef.current.style.userSelect = "none"
    }

    const arrastarTabela = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!arrastando.current || !tabelaRef.current) return

        e.preventDefault()

        const deslocamento = e.clientX - posicaoInicialX.current

        tabelaRef.current.scrollLeft = scrollInicial.current - deslocamento
    }

    const finalizarArraste = () => {
        arrastando.current = false

        if (tabelaRef.current) {
            tabelaRef.current.style.cursor = "grab"
            tabelaRef.current.style.userSelect = "auto"
        }
    }


    const medicos = prestadores.filter(prestador => prestador.tipo === 'MEDICO')

    const [botaoAdicionarConsultaProcedimento, setBotaoAdicionarConsultaProcedimento] = useState<"CONSULTA" | "PROCEDIMENTO">("CONSULTA")


    const [pesquisarPaciente, setPesquisarPaciente] = useState('')
    const [tipoDeAtendimento, setTipoDeAtendimento] = useState<"TODOS" | 'CONSULTA' | 'PROCEDIMENTO' | 'CIRURGIA-TFD'>('TODOS')
    const [statusDeAgendamento, setStatusDeAgendamento] = useState<StatusDeAgendamento>(StatusDeAgendamento.TODOS)
    const [unidadeDoClienteBusca, setUnidadeDoClienteBusca] =
        useState<string | number | null>(null)

    const opcoesUnidadesDoCliente = opcoesDeLocais(locais)

    // FILTROS
    const [campoDeBusca, setCampoDeBusca] = useState("NOME")
    const [campoDeBuscaAplicado, setCampoDeBuscaAplicado] = useState("NOME")
    const [valorDaBusca, setValorDaBusca] = useState("")
    const [valorDaBuscaAplicada, setValorDaBuscaAplicada] = useState("")

    const [visibleDialogAdicionarConsultaProcedimentoCirurgia, setVisibleDialogAdicionarConsultaProcedimentoCirurgia] = useState(false)
    const [buscarPaciente, setBuscarPaciente] = useState('')
    const [pacienteAtual, setPacienteAtual] = useState<Paciente | null>(null)
    const [unidadeDeOrigem, setUnidadeDeOrigem] = useState<Local | null>(null)

    const [dataDeEntrada, setDataDeEntrada] = useState(new Date().toISOString().split('T')[0])

    const [medicoSolicitante, setMedicoSolicitante] = useState<PrestadorComRelacoes | null>(null)
    const [buscaMedicoSolicitante, setBuscarMedicoSolicitante] = useState('')


    const [especialidadeEncaminhada, setEspecialidadeEncaminhada] = useState<number | null>(null)
    const [buscarEspecialidadeEncaminhada, setBuscarEspecialidadeEncaminhada] = useState('')

    const [categoriaDaConsulta, setCategoriaDaConsulta] = useState<CategoriaEspecialidade | null>(null)
    const [tipoDeConsulta, setTipoDeConsulta] = useState('')

    const [tipoDeCirurgia, setTipoDeCirurgia] = useState('')
    const tiposDeCirurgiaDisponiveis = especialidades.find(especialidade => especialidade.id === especialidadeEncaminhada)?.tiposDeCirurgia ?? []

    const [situacaoDeEncaminhamento, setSituacaoDeEncaminhamento] = useState("")
    const [encaminhamentoRemarcado, setEncaminhamentoRemarcado] = useState(false)
    const [condicaoDeRetorno, setCondicaoDeRetorno] = useState("")
    const [dataDoRetorno, setDataDoRetorno] = useState("")

    const [procedimentoSelecionado, setProcedimentoSelecionado] = useState<number | null>(null)
    const [buscarProcedimento, setBuscarProcedimento] = useState('')
    const [membroSelecionado, setMembroSelecionado] = useState<number | null>(null)
    const [buscarMembro, setBuscarMembro] = useState('')
    const [ladoDoMembro, setLadoDoMembro] = useState('')
    const procedimentoAtual = procedimentos.find(
        procedimento => procedimento.id === procedimentoSelecionado
    )
    const membrosDisponiveis = procedimentoAtual?.membros ?? []
    const possuiMembros = membrosDisponiveis.length > 0

    const membroAtual = membrosDisponiveis.find(
        membro => membro.id === membroSelecionado
    )
    const possuiLateralidade = membroAtual?.lateralidade === "COM_LADO"

    const [tituloResultado, setTituloResultado] = useState("");
    const [mensagemResultado, setMensagemResultado] = useState("");
    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
    const [dialogResultado, setDialogResultado] = useState(false);
    const [carregando, setCarregando] = useState(false)

    const [first, setFirst] = useState(0)
    const [rows] = useState(8)

    const membrosFiltrados = membrosDisponiveis.filter(membro =>
        normalizarTexto(membro.nome).includes(
            normalizarTexto(buscarMembro)
        )
    )

    const procedimentosFiltrados = procedimentos.filter((procedimento) =>
        normalizarTexto(procedimento.nome).includes(
            normalizarTexto(buscarProcedimento)
        )
    )

    const especialidadesEncaminhadasFiltradas = especialidades.filter((especialidade) =>
        normalizarTexto(especialidade.nome).includes(
            normalizarTexto(buscarEspecialidadeEncaminhada)
        )
    )

    const pacientesFiltrados = pacientes.filter((paciente) => {
        if (!buscarPaciente.trim()) return false
        const busca = buscarPaciente.toLowerCase().trim()
        return (
            paciente.nomeDoPaciente.toLowerCase().includes(busca) ||
            paciente.CPF?.includes(busca) ||
            paciente.cartaoDoSus?.includes(busca)
        )
    }).slice(0, 8)


    const medicosSolicitadosFiltrados = medicos.filter((medico) =>
        normalizarTexto(medico.nome).includes(
            normalizarTexto(buscaMedicoSolicitante)
        )
    )

    const [especialidadeDoPrestador, setEspecialidadeDoPrestador] = useState<string>('')
    const opcoesEspecialidade = [
        {
            valor: '',
            label: "Selecione"
        },
        ...(medicoSolicitante?.especialidades ?? [])
            .filter(item => item.especialidade.ativo)
            .map(item => ({
                valor: item.especialidade.id.toString(),
                label: item.especialidade.nome
            }))
    ]

    const opcoesUnidadesDeOrigem = opcoesDeLocais(locais)

    const limparFormulario = () => {
        // Tipo de cadastro
        setBotaoAdicionarConsultaProcedimento('CONSULTA')

        // Paciente
        setBuscarPaciente('')
        setPacienteAtual(null)

        // Origem
        setUnidadeDeOrigem(null)
        setDataDeEntrada(new Date().toISOString().split('T')[0])

        // Médico solicitante
        setMedicoSolicitante(null)
        setBuscarMedicoSolicitante('')
        setEspecialidadeDoPrestador('')

        // Consulta
        setEspecialidadeEncaminhada(null)
        setBuscarEspecialidadeEncaminhada('')
        setCategoriaDaConsulta(null)
        setTipoDeConsulta('')
        setTipoDeCirurgia('')
        setSituacaoDeEncaminhamento('')
        setEncaminhamentoRemarcado(false)
        setCondicaoDeRetorno('')
        setDataDoRetorno('')

        // Procedimento
        setProcedimentoSelecionado(null)
        setBuscarProcedimento('')
        setMembroSelecionado(null)
        setBuscarMembro('')
        setLadoDoMembro('')
    }


    const criarEncaminhamento = async () => {
        try {
            setCarregando(true)

            const dadosEncaminhamento = {
                tipo: botaoAdicionarConsultaProcedimento,

                pacienteId: pacienteAtual?.id,
                unidadeDeOrigemId: unidadeDeOrigem?.id,
                dataDeEntrada,

                medicoSolicitanteId: medicoSolicitante?.id ?? null,
                especialidadeDoPrestadorId: especialidadeDoPrestador
                    ? Number(especialidadeDoPrestador)
                    : null,

                // Dados da consulta
                categoria: botaoAdicionarConsultaProcedimento === "CONSULTA"
                    ? categoriaDaConsulta
                    : null,

                tipoDeConsulta: botaoAdicionarConsultaProcedimento === "CONSULTA"
                    ? tipoDeConsulta
                    : null,

                especialidadeEncaminhadaId: botaoAdicionarConsultaProcedimento === "CONSULTA"
                    ? especialidadeEncaminhada
                    : null,

                tipoDeCirurgia: botaoAdicionarConsultaProcedimento === "CONSULTA"
                    ? tipoDeCirurgia || null
                    : null,

                condicaoDeRetorno: botaoAdicionarConsultaProcedimento === "CONSULTA"
                    ? condicaoDeRetorno || null
                    : null,

                dataDoRetorno: botaoAdicionarConsultaProcedimento === "CONSULTA"
                    ? dataDoRetorno || null
                    : null,

                // Dados do procedimento
                procedimentoId: botaoAdicionarConsultaProcedimento === "PROCEDIMENTO"
                    ? procedimentoSelecionado
                    : null,

                membroProcedimentoId: botaoAdicionarConsultaProcedimento === "PROCEDIMENTO"
                    ? membroSelecionado
                    : null,

                lado: botaoAdicionarConsultaProcedimento === "PROCEDIMENTO"
                    ? ladoDoMembro || null
                    : null,

                // Dados comuns
                situacao: situacaoDeEncaminhamento,
                encaminhamentoRemarcado
            }
            console.log(dadosEncaminhamento)

            const resposta = await fetch("/api/criar-encaminhamento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosEncaminhamento)
            })

            const resultado = await resposta.json()

            if (!resposta.ok) {
                setTituloResultado("Erro ao cadastrar encaminhamento")
                setMensagemResultado(
                    resultado.erro || "Não foi possível cadastrar o encaminhamento."
                )
                setDialogResultado(true)
                return
            }

            setDialogConfirmacao(false)

            limparFormulario()

            setTituloResultado("Encaminhamento cadastrado!")
            setMensagemResultado("O encaminhamento foi cadastrado com sucesso.")
            setDialogResultado(true)

            await buscarEncaminhamentos()
            setVisibleDialogAdicionarConsultaProcedimentoCirurgia(false)
            // Atualizar a listagem de encaminhamentos aqui,
            // utilizando a função de atualização do seu hook.

        } catch (erro) {
            console.error("Erro ao criar encaminhamento:", erro)

            setTituloResultado("Erro ao cadastrar encaminhamento")
            setMensagemResultado("Ocorreu um erro inesperado ao cadastrar o encaminhamento.")
            setDialogResultado(true)

        } finally {
            setCarregando(false)
        }
    }

    const handleCriarEncaminhamento = () => {

        // Campos comuns
        if (!pacienteAtual) {
            setTituloResultado("Paciente não selecionado")
            setMensagemResultado("Selecione um paciente para continuar.")
            setDialogResultado(true)
            return
        }

        if (!unidadeDeOrigem) {
            setTituloResultado("Unidade não selecionada")
            setMensagemResultado("Selecione a unidade de origem.")
            setDialogResultado(true)
            return
        }

        if (!dataDeEntrada) {
            setTituloResultado("Data não informada")
            setMensagemResultado("Informe a data de entrada do encaminhamento.")
            setDialogResultado(true)
            return
        }

        if (!situacaoDeEncaminhamento) {
            setTituloResultado("Situação não informada")
            setMensagemResultado("Selecione a situação do encaminhamento.")
            setDialogResultado(true)
            return
        }

        // Validações de consulta
        if (botaoAdicionarConsultaProcedimento === "CONSULTA") {

            if (!categoriaDaConsulta) {
                setTituloResultado("Categoria não selecionada")
                setMensagemResultado("Selecione a categoria da consulta.")
                setDialogResultado(true)
                return
            }

            if (
                categoriaDaConsulta === "NORMAL" &&
                !tipoDeConsulta
            ) {
                setTituloResultado("Tipo de consulta não selecionado")
                setMensagemResultado("Selecione o tipo de consulta.")
                setDialogResultado(true)
                return
            }

            if (!especialidadeEncaminhada) {
                setTituloResultado("Especialidade não selecionada")
                setMensagemResultado("Selecione a especialidade de destino.")
                setDialogResultado(true)
                return
            }

            if (
                categoriaDaConsulta === "NORMAL" &&
                tipoDeConsulta === "RETORNO" &&
                !condicaoDeRetorno
            ) {
                setTituloResultado("Condição de retorno não informada")
                setMensagemResultado("Selecione a condição de retorno.")
                setDialogResultado(true)
                return
            }

            if (condicaoDeRetorno === "COM_DATA" && !dataDoRetorno) {
                setTituloResultado("Data de retorno não informada")
                setMensagemResultado("Informe a data do retorno.")
                setDialogResultado(true)
                return
            }
        }

        // Validações de procedimento
        if (botaoAdicionarConsultaProcedimento === "PROCEDIMENTO") {

            if (!procedimentoSelecionado) {
                setTituloResultado("Procedimento não selecionado")
                setMensagemResultado("Selecione um procedimento.")
                setDialogResultado(true)
                return
            }

            // Verificações adicionais de membro e lateralidade
            // são feitas de acordo com o procedimento selecionado.
        }

        setDialogConfirmacao(true)
    }

    const handleBuscar = async () => {
        const valor = valorDaBusca.trim()

        setCampoDeBuscaAplicado(campoDeBusca)
        setValorDaBuscaAplicada(valor)
        setFirst(0)

        await buscarEncaminhamentos({
            campoDeBusca,
            valorDaBusca: valor
        })
    }
    
    const handleAlterarTipoDeAtendimento = (tipo: "TODOS" | "CONSULTA" | "PROCEDIMENTO" | "CIRURGIA-TFD") => {
        setTipoDeAtendimento(tipo)
    }

    const encaminhamentosFiltrados = encaminhamentos.filter((encaminhamento) => {
        // FILTRO POR TIPO DE ATENDIMENTO
        if (tipoDeAtendimento === "CONSULTA") {
            return (encaminhamento.tipo === "CONSULTA" && encaminhamento.categoria === "NORMAL")
        }

        if (tipoDeAtendimento === "PROCEDIMENTO") {
            if (encaminhamento.tipo !== "PROCEDIMENTO") return false
        }

        if (tipoDeAtendimento === "CIRURGIA-TFD") {
            if (
                encaminhamento.tipo !== "CONSULTA" ||
                encaminhamento.categoria !== "TFD" ||
                !encaminhamento.tipoDeCirurgia
            ) {
                return false
            }
        }

        // FILTRO POR STATUS DE AGENDAMENTO
        if (
            statusDeAgendamento !== StatusDeAgendamento.TODOS &&
            encaminhamento.statusDeAgendamento !== statusDeAgendamento
        ) {
            return false
        }

        // FILTRO POR UNIDADE DE ORIGEM
        if (
            unidadeDoClienteBusca !== null &&
            encaminhamento.unidadeDeOrigemId !== Number(unidadeDoClienteBusca)
        ) {
            return false
        }

        // FILTRO POR NOME, CPF OU CARTÃO SUS
        if (valorDaBuscaAplicada.trim() !== "") {
            const valor = normalizarTexto(valorDaBuscaAplicada)
            const paciente = encaminhamento.paciente

            if (campoDeBuscaAplicado === CampoDeBusca.NOME) {
                if (!normalizarTexto(paciente.nomeDoPaciente).includes(valor)) {
                    return false
                }
            }

            if (campoDeBuscaAplicado === CampoDeBusca.CPF) {
                const cpfBusca = valorDaBuscaAplicada.replace(/\D/g, "")
                const cpfPaciente = (paciente.CPF ?? "").replace(/\D/g, "")

                if (!cpfPaciente.includes(cpfBusca)) {
                    return false
                }
            }

            if (campoDeBuscaAplicado === CampoDeBusca.CARTAO_SUS) {
                const susBusca = valorDaBuscaAplicada.replace(/\D/g, "")
                const susPaciente = (paciente.cartaoDoSus ?? "").replace(/\D/g, "")

                if (!susPaciente.includes(susBusca)) {
                    return false
                }
            }
        }

        return true
    })

    const buscaAgendamentosPaginados = encaminhamentosFiltrados.slice(
        first,
        first + rows
    )

    const [menuContexto, setMenuContexto] = useState<{
        x: number
        y: number
        atendimento: typeof encaminhamentos[number]
    } | null>(null)

    const [dialog, setDialog] = useState<{ tipo: AcaoPaciente, agendamento: typeof encaminhamentos[number] } | null>(null)

    const verificarSeJaEstaAgendado = (
        encaminhamento: typeof encaminhamentos[number]
    ) => {
        if (encaminhamento.statusDeAgendamento === StatusDeAgendamento.AGENDADO) {
            setTituloResultado("Encaminhamento já agendado")
            setMensagemResultado(
                "Este encaminhamento já possui um agendamento. Não é possível realizar um novo agendamento."
            )
            setDialogResultado(true)

            return true
        }

        return false
    }

    const handleAction = (
        acao: AcaoPaciente,
        agendamento: any
    ) => {
        setMenuContexto(null)

        if (acao === "requisicaoExames") {
            if (urlRequisicao) {
                URL.revokeObjectURL(urlRequisicao)
            }

            setUrlRequisicao(null)

            setDialog({
                tipo: acao,
                agendamento
            })

            return
        }

        if (
            acao === "agendamento" &&
            agendamento.statusDeAgendamento === StatusDeAgendamento.AGENDADO
        ) {
            setTituloResultado("Encaminhamento já agendado")
            setMensagemResultado(
                "Este encaminhamento já possui um agendamento. Não é possível realizar um novo agendamento."
            )
            setDialogResultado(true)
            return
        }

        setDialog({
            tipo: acao,
            agendamento
        })
    }

    const [urlRequisicao, setUrlRequisicao] = useState<string | null>(null)
    const [gerandoRequisicao, setGerandoRequisicao] = useState(false)

    const abrirRequisicaoExames = async () => {
        try {
            const codigoDeBarras = gerarCodigoDeBarras(
                String(dialog?.agendamento.id)
            )

            console.log(dialog?.agendamento)

            setGerandoRequisicao(true)
            let documento

            if (dialog?.agendamento?.tipo === "PROCEDIMENTO") {
                documento = (
                    <DocumentoRequisicaoProcedimentos
                        encaminhamento={dialog.agendamento}
                        codigoDeBarras={codigoDeBarras}
                    />
                )
            }

            if (dialog?.agendamento?.tipo === "CONSULTA") {
                documento = (
                    <DocumentoRequisicaoConsultas
                        encaminhamento={dialog.agendamento}
                        codigoDeBarras={codigoDeBarras}
                    />
                )
            }
            const blob = await pdf(documento).toBlob()
            const url = URL.createObjectURL(blob)

            setUrlRequisicao(url)
        } catch (error) {
            console.error("Erro ao gerar requisição de exames:", error)
        } finally {
            setGerandoRequisicao(false)
        }
    }



    return (
        <Template>
            <div className="p-4 text-verde-escuro flex flex-col gap-4 h-full">
                <div className="p-4 flex flex-col gap-4 row-span-2 h-full">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center my-auto gap-2 text-verde-escuro">
                            <FaFileMedicalAlt className="text-5xl" />
                            <div className="flex flex-col">
                                <h3 className="text-3xl font-bold">Consultas e Procedimentos</h3>
                                <p className="-mt-1">Busque informações entre Consultas, Procedimentos e Cirurgias</p>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => setVisibleDialogAdicionarConsultaProcedimentoCirurgia(true)} className="flex items-center gap-2 rounded-lg px-4 h-[45px] bg-verde-escuro text-white font-bold">
                                <FaPlus />
                                <p>Adicionar</p>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 h-full">
                        <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-2 text-xl font-bold text-verde">
                                    <FaListCheck />
                                    <h2>Resultado das pesquisas</h2>
                                </div>
                                <div className="flex justify-center items-center">
                                    <button className="text-3xl text-verde">
                                        <TbFilterCog />
                                    </button>
                                </div>
                            </div>
                            {/* filtros */}
                            <div>
                                <div className="grid grid-cols-[160px_160px_200px_1fr_140px] gap-4 2xl:grid-cols-[160px_160px_260px_1fr_140px]">
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="tipoDeDado"
                                        label="Tipo de busca"
                                        nome="tipoDeDado"
                                        setValor={setCampoDeBusca}
                                        valor={campoDeBusca}
                                        opcoes={opcoesCampoDeBusca}
                                    />
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="status"
                                        label="Status"
                                        nome="status"
                                        setValor={setStatusDeAgendamento}
                                        valor={statusDeAgendamento}
                                        opcoes={opcoesStatusDeAgendamento}
                                    />
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="unidadeCliente"
                                        label="Unidade do cliente"
                                        nome="unidadeCliente"
                                        setValor={setUnidadeDoClienteBusca}
                                        valor={unidadeDoClienteBusca}
                                        opcoes={opcoesUnidadesDoCliente}
                                    />
                                    {/* vai ter que ser um input especial depois */}
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="valor"
                                        label="Valor"
                                        nome="valor"
                                        placeholder={`${campoDeBusca === CampoDeBusca.NOME ? "Informe o nome do paciente..." : ""}${campoDeBusca === CampoDeBusca.CPF ? "000.000.000-00" : ""}${campoDeBusca === CampoDeBusca.CARTAO_SUS ? "797.4072.0237.0003" : ""}`}
                                        setValor={setValorDaBusca}
                                        valor={valorDaBusca} />
                                    <button
                                        type="button"
                                        onClick={handleBuscar}
                                        className="font-bold bg-verde text-white h-fit mt-auto py-2 px-5 rounded-lg hover:bg-verde-escuro transition-all"
                                    >
                                        {carregandoEncaminhamentos ? "Buscando..." : "Buscar"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Filtros por tipo */}
                        <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg py-2 px-4 gap-3 relative flex justify-between">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => handleAlterarTipoDeAtendimento("TODOS")}
                                    className={`p-3 font-bold ${tipoDeAtendimento === 'TODOS' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}
                                >
                                    <p>Todos</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleAlterarTipoDeAtendimento("CONSULTA")}
                                    className={`p-3 font-bold ${tipoDeAtendimento === 'CONSULTA' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}
                                >
                                    <p>Consultas</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleAlterarTipoDeAtendimento("PROCEDIMENTO")}
                                    className={`p-3 font-bold ${tipoDeAtendimento === 'PROCEDIMENTO' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}
                                >
                                    <p>Procedimento</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleAlterarTipoDeAtendimento("CIRURGIA-TFD")}
                                    className={`p-3 font-bold ${tipoDeAtendimento === 'CIRURGIA-TFD' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}
                                >
                                    <p>Cirurgias</p>
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <div className="bg-green-200 w-6 h-4 rounded-md border broder-black"></div>
                                    <p className="font-bold text-sm">Consulta</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="bg-blue-200 w-6 h-4 rounded-md border broder-black"></div>
                                    <p className="font-bold text-sm">Consulta - TFD</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="bg-orange-200 w-6 h-4 rounded-md border broder-black"></div>
                                    <p className="font-bold text-sm">Procedimentos</p>
                                </div>
                            </div>
                        </div>

                        {
                            encaminhamentosFiltrados.length <= 0 ? (
                                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg py-2 px-4 gap-3 relative flex justify-between h-full">
                                    <div className="relative mx-auto 2xl:w-[1000px] 2xl:h-[410px]">
                                        <Image alt="nenhum encaminhamento encontrado" src={'/nenhum-encaminhamento-encontrado.png'} fill className="object-contain" />
                                    </div>
                                </div>
                            ) : (
                                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg py-2 px-4 gap-3 relative flex flex-col justify-between w-full h-full overflow-hidden">
                                    <div
                                        ref={tabelaRef}
                                        onMouseDown={(e) => {
                                            if (e.button !== 0) return
                                            iniciarArraste(e)
                                        }}
                                        onMouseMove={arrastarTabela}
                                        onMouseUp={finalizarArraste}
                                        onMouseLeave={finalizarArraste}
                                        className="w-full overflow-x-auto pb-2 h-full cursor-grab"
                                    >
                                        <div className="min-w-[3340px]">
                                            <ul className="grid grid-cols-[50px_100px_200px_230px_230px_230px_200px_300px__200px_200px_200px_200px_200px_200px_200px_200px_200px] w-full font-bold border-b">
                                                <li className="flex justify-center items-center py-2 bg-red-500 text-white border border-zinc-900">
                                                    <TbUrgent className="text-2xl font-bold" />
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>ID</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Data de Entrada</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Nome</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Nome da Mãe</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Codigo IDS</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Data de Nascimento</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Especialidade/Procedimento</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Tipo</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Condição de Retorno</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Situação</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Médico Solicitante</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Contato</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Data de Saída</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Data de Agendamento</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Local de Atendimento</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Prestador Executante</p>
                                                </li>
                                            </ul>
                                            <div>
                                                {
                                                    buscaAgendamentosPaginados.length > 0 ? (
                                                        <ul className="flex flex-col">
                                                            {
                                                                buscaAgendamentosPaginados.map((encaminhamento, i) => {
                                                                    const prestadorExecutante = prestadores.find(prestador => prestador.id == encaminhamento.prestadorExecutanteId)
                                                                    const localDeAtendimento = locais.find(local => local.id === encaminhamento.localDeAtendimentoId)

                                                                    return (
                                                                        <li key={i}
                                                                            onContextMenu={(e) => {
                                                                                e.preventDefault()
                                                                                setMenuContexto({
                                                                                    x: e.clientX,
                                                                                    y: e.clientY - 200,
                                                                                    atendimento: encaminhamento,
                                                                                })
                                                                            }}
                                                                            className={`
                                                                                grid grid-cols-[50px_100px_200px_230px_230px_230px_200px_300px__200px_200px_200px_200px_200px_200px_200px_200px_200px] w-full border-b items-center cursor-pointer border-l border-r border-zinc-700 pt-2 pb-1 text-black
                                                                                ${encaminhamento.tipo === 'CONSULTA' && encaminhamento.categoria === 'NORMAL' ? 'bg-green-200' : ''}
                                                                                ${encaminhamento.tipo === 'CONSULTA' && encaminhamento.categoria === 'TFD' ? 'bg-blue-200' : ''}
                                                                                ${encaminhamento.tipo === 'PROCEDIMENTO' ? 'bg-orange-200' : ''}
                                                                            `}>
                                                                            <div className="flex justify-center items-center relative gap-1">
                                                                                <div className="relative group">
                                                                                    {encaminhamento.situacao === "URGENTE" && (
                                                                                        <div className="text-amber-500 bg-white flex justify-center items-center h-8 w-8 rounded-full shadow-[0px_0px_1px_black] cursor-help">
                                                                                            <RxRows />
                                                                                        </div>
                                                                                    )}
                                                                                    {encaminhamento.situacao === "PRIORIDADE" && (
                                                                                        <div className="text-amber-500 bg-white flex justify-center items-center h-8 w-8 rounded-full shadow-[0px_0px_1px_black] cursor-help">
                                                                                            <MdTableRows />
                                                                                        </div>
                                                                                    )}
                                                                                    {encaminhamento.situacao === "NORMAL" && (
                                                                                        <div className="text-zinc-700 bg-white flex justify-center items-center h-8 w-8 rounded-full shadow-[0px_0px_1px_black] cursor-help">
                                                                                            <LuMinus />
                                                                                        </div>
                                                                                    )}
                                                                                    {/* TOOLTIP */}
                                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[999] whitespace-nowrap">
                                                                                        <div className="bg-zinc-800 text-white text-[.5em] font-medium px-2 py-1 rounded-md  shadow-lg">
                                                                                            {encaminhamento.situacao}
                                                                                        </div>
                                                                                        {/* SETINHA */}
                                                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-800" />
                                                                                    </div>
                                                                                </div>
                                                                                {encaminhamento.encaminhamentoRemarcado && (
                                                                                    <div className="absolute -top-1.5 right-0 group">
                                                                                        {/* ÍCONE */}
                                                                                        <div className="w-4 h-4 rounded-full bg-verde text-white flex items-center justify-center cursor-help shadow-sm border border-white">
                                                                                            <FaClockRotateLeft className="text-[.5em]" />
                                                                                        </div>
                                                                                        {/* TOOLTIP */}
                                                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[999] whitespace-nowrap">
                                                                                            <div className="bg-zinc-800 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg">
                                                                                                Já Marcado
                                                                                            </div>
                                                                                            {/* SETINHA */}
                                                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-800" />
                                                                                        </div>
                                                                                    </div>
                                                                                )}

                                                                            </div>
                                                                            <div className="flex justify-center items-center relative">
                                                                                <p className="cursor-auto">{encaminhamento.id}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p>
                                                                                    {new Date(encaminhamento.createdAt).toISOString().split("T")[0].split("-").reverse().join("/")}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p>{encaminhamento.paciente.nomeDoPaciente}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p>{encaminhamento.paciente.nomeDaMae}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center relative">
                                                                                <p>{encaminhamento.paciente.codigoIDS}</p>
                                                                                <div className="absolute -top-2 right-0">
                                                                                    <button>
                                                                                        <MdCopyAll />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p>
                                                                                    {new Date(encaminhamento.paciente.dataDeNascimento).toISOString().split("T")[0].split("-").reverse().join("/")}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center text-center">
                                                                                {encaminhamento.tipo === "CONSULTA" && (
                                                                                    <p className="capitalize">
                                                                                        {encaminhamento.categoria === "TFD"
                                                                                            ? `${encaminhamento.especialidadeEncaminhada?.nome ?? "—"} - ${encaminhamento.tipoDeCirurgia ?? "—"}`
                                                                                            : encaminhamento.especialidadeEncaminhada?.nome ?? "—"
                                                                                        }
                                                                                    </p>
                                                                                )}

                                                                                {encaminhamento.tipo === "PROCEDIMENTO" && (
                                                                                    <p className="capitalize">
                                                                                        {encaminhamento.procedimento?.nome || "—"}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-center capitalize">
                                                                                    {
                                                                                        encaminhamento.tipoDeConsulta === null ? ("-") : (
                                                                                            encaminhamento.tipoDeConsulta?.replaceAll("_", " ").toLowerCase()
                                                                                        )
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-center capitalize">
                                                                                    {encaminhamento.condicaoDeRetorno?.replaceAll("_", " ").toLowerCase() || "-"}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize">{encaminhamento.statusDeAgendamento.replaceAll('_', ' ').toLowerCase()}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize truncate px-2">{encaminhamento.medicoSolicitante?.nome}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center relative">
                                                                                <p className="capitalize">{encaminhamento.paciente.telefoneWhatsApp}</p>
                                                                                <a
                                                                                    href={`https://wa.me/55${encaminhamento.paciente.telefoneWhatsApp?.replace(/\D/g, '')}`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="absolute -top-1 right-2"
                                                                                >
                                                                                    <TbPhoneCalling />
                                                                                </a>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize">{encaminhamento.dataDeSaida ? new Date(encaminhamento.dataDeSaida).toISOString().split("T")[0].split("-").reverse().join("/") : '—'}</p>
                                                                            </div>

                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize">{encaminhamento.dataDeAgendamentoLocal ? new Date(encaminhamento.dataDeAgendamentoLocal).toISOString().split("T")[0].split("-").reverse().join("/") : '—'}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize">{localDeAtendimento?.nome || '—'}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize">{prestadorExecutante?.nome || '—'}</p>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    ) : (
                                                        <div>
                                                            <h4>Sem especialidades cadastradas</h4>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[300px_1fr] mt-auto -mb-2">
                                        <p className="my-auto">Mostrando 1 a {rows >= encaminhamentosFiltrados.length ? encaminhamentosFiltrados.length : rows} de {encaminhamentosFiltrados.length} registros</p>
                                        <Paginator
                                            first={first}
                                            rows={rows}
                                            totalRecords={encaminhamentosFiltrados.length}
                                            onPageChange={(event: PaginatorPageChangeEvent) => {
                                                setFirst(event.first)
                                            }}
                                            className="my-auto"
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            <Dialog
                header={
                    <div>
                        <h2>Nova Consulta/Procedimento/Cirurgia</h2>
                    </div>
                }
                visible={visibleDialogAdicionarConsultaProcedimentoCirurgia}
                className="max-w-[95%] w-full 2xl:max-w-[1200px]"
                onHide={() => {
                    if (!visibleDialogAdicionarConsultaProcedimentoCirurgia) return
                    setVisibleDialogAdicionarConsultaProcedimentoCirurgia(false)
                    setBuscarPaciente('')
                    setPacienteAtual(null)
                }}
            >
                <div className="p-4 pb-0">
                    {/* PACIENTE */}
                    <div className="flex flex-col gap-2 relative">
                        <div className="bg-white border border-zinc-200 rounded-lg shadow-lg p-4 flex flex-col gap-2">
                            <label htmlFor="buscarPaciente" className="flex items-center gap-2 text-xl font-bold">
                                <FaHandHoldingMedical className="text-3xl" />
                                <h3>Paciente:</h3>
                            </label>
                            <input
                                id="buscarPaciente"
                                type="text"
                                value={
                                    pacienteAtual
                                        ? pacienteAtual.nomeDoPaciente
                                        : buscarPaciente
                                }
                                onChange={(e) => {
                                    setBuscarPaciente(e.target.value)
                                    setPacienteAtual(null)
                                }}
                                placeholder="Digite o nome, CPF ou Cartão SUS..."
                                autoComplete="off"
                                className="w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-verde focus:ring-1 focus:ring-verde"
                            />
                        </div>

                        {!pacienteAtual &&
                            buscarPaciente.trim() !== '' &&
                            (
                                <div className="absolute top-24 left-0 mx-4 right-0 z-50 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden">
                                    {pacientesFiltrados.length > 0 ? (
                                        pacientesFiltrados.map((paciente) => (
                                            <button
                                                type="button"
                                                key={paciente.id}
                                                onClick={() => {
                                                    setPacienteAtual(paciente)
                                                    setBuscarPaciente('')
                                                    const localPacienteSelecionado = locais.find(
                                                        local =>
                                                            paciente.unidadeDeSaudeId !== null &&
                                                            local.id === Number(paciente.unidadeDeSaudeId)
                                                    )
                                                    localPacienteSelecionado && setUnidadeDeOrigem(localPacienteSelecionado)
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-zinc-100 transition"
                                            >
                                                <p className="font-semibold text-zinc-800">
                                                    {paciente.nomeDoPaciente}
                                                </p>
                                                <div className="flex gap-4 text-xs text-zinc-500 mt-1">
                                                    <span>
                                                        CPF: {paciente.CPF}
                                                    </span>
                                                    <span>
                                                        CNS: {paciente.cartaoDoSus}
                                                    </span>
                                                    <span>
                                                        Mãe: {paciente.nomeDaMae}
                                                    </span>
                                                    <span>
                                                        Endereço: {`${paciente.rua}, ${paciente.numero} - ${paciente.bairro}`}
                                                    </span>
                                                    <span>
                                                        Agente Comunitário: Agente Bem Legal
                                                    </span>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-zinc-500">
                                            Nenhum paciente encontrado.
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        {/* Usuario Selecionado */}
                        {
                            pacienteAtual && (
                                <div className="border border-zinc-200 flex flex-col gap-4 mt-4 p-4 rounded-lg w-full">
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <FaUserPen className="text-3xl" />
                                        <h3>Informações do paciente:</h3>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <ul className="grid grid-cols-3 w-full gap-2">
                                            <li className="flex items-center gap-2">
                                                <span>Nome:</span>
                                                <p className="line-clamp-1">{pacienteAtual?.nomeDoPaciente}</p>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span>Sexo:</span>
                                                <p>{pacienteAtual?.sexo}</p>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span>CEP:</span>
                                                <p>{pacienteAtual?.CEP}</p>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span>Cidade:</span>
                                                <p>{pacienteAtual?.municipio}</p>
                                            </li>
                                            <li className="flex items-center gap-2 col-span-2">
                                                <span>Endereço:</span>
                                                <p>{`${pacienteAtual?.rua}, ${pacienteAtual?.numero} - ${pacienteAtual?.bairro} ${pacienteAtual?.complemento ? (`(${pacienteAtual?.complemento})`) : ''}`}</p>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span>CPF:</span>
                                                <p>{pacienteAtual?.CPF}</p>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span>CNS:</span>
                                                <p>{pacienteAtual?.cartaoDoSus}</p>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span>Mãe:</span>
                                                <p>{pacienteAtual?.nomeDaMae}</p>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span>Pai:</span>
                                                <p>{pacienteAtual?.nomeDoPai}</p>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span>Idade:</span>
                                                {/* <p>{pacienteAtual.dataDeNascimento.toLocaleDateString()}</p> */}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span>Telefone 1:</span>
                                                {/* <p>{pacienteAtual.numero}</p> */}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span>Telefone 2:</span>
                                                {/* <p>{pacienteAtual.numero}</p> */}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span>Unidade Solicitante:</span>
                                                <p>{pacienteAtual?.unidadeDeSaudeId}</p>
                                            </li>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPacienteAtual(null)
                                                    setBuscarPaciente('')
                                                }}
                                                className="col-span-2 py-1 rounded-lg text-red-500 font-bold hover:text-red-700 border border-red-600"
                                            >
                                                Alterar
                                            </button>
                                        </ul>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    {/* Selecionar Consulta ou procedimento */}
                    <div className="border border-zinc-200 grid grid-cols-2 gap-4 mt-4 p-4 rounded-lg w-full">
                        <button onClick={() => setBotaoAdicionarConsultaProcedimento("CONSULTA")} className={`flex items-center justify-center gap-2 text-xl font-bold border py-1 rounded-lg ${botaoAdicionarConsultaProcedimento === 'CONSULTA' ? 'border-verde text-verde' : 'border-zinc-200'}`}>
                            <MdOutlineMedicalInformation />
                            <p>Consultas</p>
                        </button>
                        <button onClick={() => setBotaoAdicionarConsultaProcedimento("PROCEDIMENTO")} className={`flex items-center justify-center gap-2 text-xl font-bold border py-1 rounded-lg ${botaoAdicionarConsultaProcedimento === 'PROCEDIMENTO' ? 'border-verde text-verde' : 'border-zinc-200'}`}>
                            <LiaProceduresSolid />
                            <p>Procedimentos</p>
                        </button>
                    </div>

                    {/* Origem */}
                    <div className="border border-zinc-200 flex flex-col gap-4 mt-4 p-4 rounded-lg w-full">
                        <div className="flex items-center gap-2 text-xl font-bold">
                            <FaSourcetree className="text-3xl" />
                            <h3>Origem:</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 gap-x-6">
                            {/* Unidade de origem */}
                            <div>
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="unidadeDeOrigem"
                                    label="Unidade de Origem"
                                    nome="unidadeDeOrigem"
                                    setValor={(valor) => {
                                        const local = locais.find(
                                            local => String(local.id) === valor
                                        )

                                        setUnidadeDeOrigem(local ?? null)
                                    }}
                                    valor={unidadeDeOrigem ? String(unidadeDeOrigem.id) : ''}
                                    opcoes={opcoesUnidadesDeOrigem}
                                />
                            </div>
                            {/* Data de entrada */}
                            <div>
                                <InputData icone={<HiOutlineCalendarDateRange />} id="dataDeEntrada" label="Data de Entrada" nome="dataDeEntrada" placeholder="Data de Entrada" setValor={setDataDeEntrada} valor={dataDeEntrada} />
                            </div>
                            {/* Medico */}
                            <div className="flex flex-col gap-1 relative">
                                <label
                                    htmlFor="buscaMedicoSolicitante"
                                    className="font-semibold text-zinc-700"
                                >
                                    Médico Solicitante
                                </label>
                                <input
                                    id="buscaMedicoSolicitante"
                                    type="text"
                                    value={
                                        medicoSolicitante
                                            ? medicoSolicitante.nome
                                            : buscaMedicoSolicitante
                                    }
                                    onChange={(e) => {
                                        setBuscarMedicoSolicitante(e.target.value)
                                        setMedicoSolicitante(null)
                                    }}
                                    placeholder="Digite o nome do prestador..."
                                    autoComplete="off"
                                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-verde focus:ring-1 focus:ring-verde"
                                />
                                {!medicoSolicitante &&
                                    buscaMedicoSolicitante.trim() !== '' && (
                                        <div
                                            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden"
                                        >
                                            {medicosSolicitadosFiltrados.length > 0 ? (
                                                medicosSolicitadosFiltrados.map((medico) => (
                                                    <button
                                                        type="button"
                                                        key={medico.id}
                                                        onClick={() => {
                                                            setMedicoSolicitante(medico)
                                                            setBuscarMedicoSolicitante('')
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
                                                            {medico.nome}
                                                        </p>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-sm text-zinc-500">
                                                    Nenhum prestador encontrado.
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>
                            {/* Especialidade do medico */}
                            <div className="mt-auto">
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="especialidadeDoPrestador"
                                    label="Selecione a Especialidade Do Médico"
                                    nome="especialidadeDoPrestador"
                                    setValor={setEspecialidadeDoPrestador}
                                    valor={especialidadeDoPrestador}
                                    opcoes={opcoesEspecialidade}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Destino */}
                    {
                        botaoAdicionarConsultaProcedimento === 'CONSULTA' ? (
                            <div>
                                {/* Destino */}
                                <div className="border border-zinc-200 flex flex-col gap-4 mt-4 p-4 rounded-lg w-full">
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <IoMapSharp className="text-3xl" />
                                        <h3>Destino:</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Categoria */}
                                            <div className="flex items-center w-full gap-4">
                                                {/* Categoria de atendimento */}
                                                <div className="w-full">
                                                    <InputSelect
                                                        icone={<AiOutlineSelect />}
                                                        id="categoriaDaConsulta"
                                                        label="Categoria de Atendimento"
                                                        nome="categoriaDaConsulta"
                                                        setValor={setCategoriaDaConsulta}
                                                        valor={categoriaDaConsulta}
                                                        opcoes={opcoesCategoriaDaConsulta}
                                                    />
                                                </div>
                                            </div>
                                            {/* Tipo de consulta */}
                                            <div className={`mt-auto ${categoriaDaConsulta === 'NORMAL' ? "opacity-100" : "opacity-40"}`}>
                                                <InputSelect
                                                    icone={<AiOutlineSelect />}
                                                    id="tipoDeConsulta"
                                                    label="Tipo de Consulta"
                                                    nome="tipoDeConsulta"
                                                    setValor={setTipoDeConsulta}
                                                    disabled={categoriaDaConsulta === 'NORMAL' ? false : true}
                                                    valor={tipoDeConsulta}
                                                    opcoes={opcoesTipoDeConsulta}
                                                />
                                            </div>
                                        </div>
                                        {/* Especialidade */}
                                        <div className={`flex flex-col relative ${categoriaDaConsulta === null ? "opacity-30" : "opacity-100"}`}>
                                            <label
                                                htmlFor="buscarEspecialidadeEncaminhada"
                                                className="font-semibold text-zinc-700"
                                            >
                                                Encaminho para especialidade
                                            </label>
                                            <input
                                                id="buscarEspecialidadeEncaminhada"
                                                type="text"
                                                value={
                                                    especialidadeEncaminhada
                                                        ? especialidades.find(
                                                            esp => esp.id === especialidadeEncaminhada
                                                        )?.nome ?? ''
                                                        : buscarEspecialidadeEncaminhada
                                                }
                                                onChange={(e) => {
                                                    setBuscarEspecialidadeEncaminhada(e.target.value)
                                                    setEspecialidadeEncaminhada(null)
                                                }}
                                                disabled={categoriaDaConsulta === null ? true : false}
                                                placeholder="Digite a especialidade..."
                                                autoComplete="off"
                                                className="w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-verde focus:ring-1 focus:ring-verde"
                                            />
                                            {!especialidadeEncaminhada &&
                                                buscarEspecialidadeEncaminhada.trim() !== '' && (
                                                    <div
                                                        className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden"
                                                    >
                                                        {especialidadesEncaminhadasFiltradas.length > 0 ? (
                                                            especialidadesEncaminhadasFiltradas.map((especialidade) => (
                                                                <button
                                                                    type="button"
                                                                    key={especialidade.id}
                                                                    onClick={() => {
                                                                        setEspecialidadeEncaminhada(especialidade.id)
                                                                        setBuscarEspecialidadeEncaminhada('')
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
                                        </div>

                                        {/* Tipo de cirurgia */}
                                        <div className={`flex flex-col gap-1 ${categoriaDaConsulta === "TFD" ? "opacity-100" : 'opacity-30'}`}>
                                            <label
                                                htmlFor="tipoDeCirurgia"
                                                className="font-semibold text-zinc-700"
                                            >
                                                Tipo de cirurgia:
                                                <span className="font-normal text-zinc-500"> (opcional)</span>
                                            </label>

                                            <select
                                                id="tipoDeCirurgia"
                                                value={tipoDeCirurgia}
                                                onChange={(e) => setTipoDeCirurgia(e.target.value)}
                                                disabled={categoriaDaConsulta === 'TFD' ? false : true}
                                                className="w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-verde focus:ring-1 focus:ring-verde"
                                            >
                                                <option value="">Selecione o tipo de cirurgia</option>

                                                {tiposDeCirurgiaDisponiveis.map((cirurgia) => (
                                                    <option key={cirurgia.id} value={cirurgia.nome}>
                                                        {cirurgia.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1 relative">
                                                <InputSelect
                                                    icone={<AiOutlineSelect />}
                                                    id="situacao"
                                                    label="Situação"
                                                    nome="situacao"
                                                    setValor={setSituacaoDeEncaminhamento}
                                                    valor={situacaoDeEncaminhamento}
                                                    disabled={categoriaDaConsulta === null ? true : false}
                                                    opcoes={opcoesSituacaoDeEncaminhamento}
                                                    estiloPersonalizado={`${categoriaDaConsulta === null ? "opacity-30" : "opacity-100"}`}
                                                />
                                            </div>
                                            <div className="mt-auto -mb-1">
                                                <InputCheckbox
                                                    label="Encaminhamento já remarcado"
                                                    id="encaminhamentoRemarcado"
                                                    nome="encaminhamentoRemarcado"
                                                    valor={encaminhamentoRemarcado}
                                                    setValor={setEncaminhamentoRemarcado}
                                                    disabled={categoriaDaConsulta === null ? true : false}
                                                />
                                            </div>
                                        </div>
                                        {/* Condição de retorno */}
                                        <div className={`${tipoDeConsulta === 'PRIMEIRA_CONSULTA' ? 'opacity-30' : ''}`}>
                                            <InputSelect
                                                icone={<AiOutlineSelect />}
                                                id="condicaoDeRetorno"
                                                label="Condição de Retorno"
                                                nome="condicaoDeRetorno"
                                                setValor={setCondicaoDeRetorno}
                                                valor={condicaoDeRetorno}
                                                opcoes={opcoesPossibilidadeDeRetorno}
                                                estiloPersonalizado={`${tipoDeConsulta === 'PRIMEIRA_CONSULTA' || categoriaDaConsulta === 'NORMAL' ? 'opacity-100' : 'opacity-30'}`}
                                                disabled={tipoDeConsulta === 'PRIMEIRA_CONSULTA' || categoriaDaConsulta !== 'NORMAL'}

                                            />
                                        </div>
                                        {/* Data de retorno */}
                                        <div className={`${tipoDeConsulta === 'PRIMEIRA_CONSULTA' ? 'opacity-30' : ''}`}>
                                            <InputData icone={<HiOutlineCalendarDateRange />} id="dataDoRetorno" label="Data do Retorno" nome="dataDoRetorno" placeholder="Data do Retorno" setValor={setDataDoRetorno} valor={dataDoRetorno} disabled={tipoDeConsulta === 'PRIMEIRA_CONSULTA' || categoriaDaConsulta !== 'NORMAL'} estiloPersonalizado={`${tipoDeConsulta === 'PRIMEIRA_CONSULTA' || categoriaDaConsulta === 'NORMAL' ? 'opacity-100' : 'opacity-30'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <div>
                                <div className="border border-zinc-200 gap-4 mt-4 p-4 rounded-lg w-full grid grid-cols-2">
                                    <div className="flex items-center gap-2 text-xl font-bold col-span-2">
                                        <IoMapSharp className="text-3xl" />
                                        <h3>Destino:</h3>
                                    </div>
                                    {/* PROCEDIMENTO PAI */}
                                    <div className="flex flex-col gap-1 relative">
                                        <label
                                            htmlFor="buscarProcedimento"
                                            className="font-semibold text-zinc-700"
                                        >
                                            Solicito o Procedimento
                                        </label>
                                        <input
                                            id="buscarProcedimento"
                                            type="text"
                                            value={
                                                procedimentoSelecionado
                                                    ? procedimentos.find(
                                                        procedimento =>
                                                            procedimento.id === procedimentoSelecionado
                                                    )?.nome ?? ''
                                                    : buscarProcedimento
                                            }
                                            onChange={(e) => {
                                                setBuscarProcedimento(e.target.value)
                                                setProcedimentoSelecionado(null)

                                                setMembroSelecionado(null)
                                                setBuscarMembro('')
                                                setLadoDoMembro('')
                                            }}
                                            placeholder="Digite o procedimento..."
                                            autoComplete="off"
                                            className="w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-verde focus:ring-1 focus:ring-verde"
                                        />

                                        {!procedimentoSelecionado &&
                                            buscarProcedimento.trim() !== '' && (
                                                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden">
                                                    {procedimentosFiltrados.length > 0 ? (
                                                        procedimentosFiltrados.map((procedimento) => (
                                                            <button
                                                                type="button"
                                                                key={procedimento.id}
                                                                onClick={() => {
                                                                    setProcedimentoSelecionado(procedimento.id)
                                                                    setBuscarProcedimento('')

                                                                    setMembroSelecionado(null)
                                                                    setBuscarMembro('')
                                                                    setLadoDoMembro('')
                                                                }}
                                                                className="w-full text-left px-4 py-3 hover:bg-green-50 border-bborder-zinc-100 transition "
                                                            >
                                                                <p className="font-semibold text-zinc-800">
                                                                    {procedimento.nome}
                                                                </p>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-3 text-sm text-zinc-500">
                                                            Nenhum procedimento encontrado.
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    {/* MEMBRO DO PROCEDIMENTO */}
                                    <div className={`flex flex-col gap-1 relative ${possuiMembros ? "opacity-100" : "opacity-30"}`}>
                                        <label
                                            htmlFor="buscarMembro"
                                            className="font-semibold text-zinc-700"
                                        >
                                            Membro / Região:
                                        </label>

                                        <input
                                            id="buscarMembro"
                                            type="text"
                                            value={
                                                membroSelecionado
                                                    ? membroAtual?.nome ?? ''
                                                    : buscarMembro
                                            }
                                            onChange={(e) => {
                                                setBuscarMembro(e.target.value)
                                                setMembroSelecionado(null)
                                                setLadoDoMembro('')
                                            }}
                                            disabled={!possuiMembros}
                                            placeholder="Digite o membro ou região..."
                                            autoComplete="off"
                                            className="w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-verde focus:ring-1 focus:ring-verde"
                                        />

                                        {!membroSelecionado && buscarMembro.trim() !== '' && (
                                            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden">
                                                {membrosFiltrados.length > 0 ? (
                                                    membrosFiltrados.map((membro) => (
                                                        <button
                                                            type="button"
                                                            key={membro.id}
                                                            onClick={() => {
                                                                setMembroSelecionado(membro.id)
                                                                setBuscarMembro('')
                                                                setLadoDoMembro('')
                                                            }}
                                                            className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-zinc-100 transition"
                                                        >
                                                            <p className="font-semibold text-zinc-800">
                                                                {membro.nome}
                                                            </p>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-zinc-500">
                                                        Nenhum membro encontrado.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {/* Definir lado do membro */}
                                    <div>
                                        <InputSelect
                                            icone={<AiOutlineSelect />}
                                            id="ladoDoMembro"
                                            label="Lateralidade"
                                            nome="ladoDoMembro"
                                            setValor={setLadoDoMembro}
                                            valor={ladoDoMembro}
                                            opcoes={opcoesLadoDoCorpo}
                                            disabled={!possuiLateralidade}
                                            estiloPersonalizado={`${possuiLateralidade ? "opacity-100" : "opacity-30"}`}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1 relative">
                                            <InputSelect
                                                icone={<AiOutlineSelect />}
                                                id="situacao"
                                                label="Situação"
                                                nome="situacao"
                                                setValor={setSituacaoDeEncaminhamento}
                                                valor={situacaoDeEncaminhamento}
                                                opcoes={opcoesSituacaoDeEncaminhamento}
                                            />
                                        </div>
                                        <div className="mt-auto -mb-1">
                                            <InputCheckbox
                                                label="Encaminhamento já remarcado"
                                                id="encaminhamentoRemarcado"
                                                nome="encaminhamentoRemarcado"
                                                valor={encaminhamentoRemarcado}
                                                setValor={setEncaminhamentoRemarcado}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Botões de ação */}
                    <div className="grid grid-cols-2 gap-4 w-fit ml-auto mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                limparFormulario()
                                setVisibleDialogAdicionarConsultaProcedimentoCirurgia(false)
                            }}
                            className="flex items-center justify-center gap-2 rounded-lg px-4 h-[45px] bg-white text-red-600 border border-red-600 font-bold text-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                            <FaPlus />
                            <p>Cancelar</p>
                        </button>
                        <button
                            type="button"
                            onClick={handleCriarEncaminhamento}
                            disabled={carregando}
                            className="flex items-center justify-center gap-2 rounded-lg px-4 h-[45px] bg-white text-verde border border-verde font-bold text-xl hover:bg-verde hover:text-white transition-all duration-300"
                        >
                            <FaPlus />
                            <p>{carregando ? "Salvando..." : "Cadastrar"}</p>
                        </button>
                    </div>
                </div>
            </Dialog>

            {menuContexto && (
                <MenuContextoPaciente
                    x={menuContexto.x}
                    y={menuContexto.y}
                    agendamento={menuContexto.atendimento}
                    onClose={() => setMenuContexto(null)}
                    onAction={handleAction}
                />
            )}

            <Dialog
                header={
                    dialog?.tipo === "agendamento"
                        ? "Incluir Agendamento"
                        : dialog?.tipo === "alterar"
                            ? "Alterar Agendamento"
                            : dialog?.tipo === "historico"
                                ? "Histórico do Cliente"
                                : dialog?.tipo === "requisicaoExames"
                                    ? "Requisição de Encaminhamento"
                                    : "Ação"
                }
                visible={dialog !== null}
                onHide={() => {
                    if (urlRequisicao) {
                        URL.revokeObjectURL(urlRequisicao)
                    }

                    setUrlRequisicao(null)
                    setDialog(null)
                }}
                className="w-full max-w-[1000px]"
            >
                {dialog?.tipo === "agendamento" && (
                    <FormIncluirAgendamento
                        encaminhamento={dialog.agendamento}
                        onClose={() => setDialog(null)}
                        onAgendamentoSalvo={() => {
                            buscarEncaminhamentos()
                        }}
                    />
                )}

                {dialog?.tipo === "requisicaoExames" && (
                    <div className="flex flex-col gap-4">

                        {!urlRequisicao ? (
                            <>
                                <p className="text-sm text-zinc-600">
                                    Deseja gerar uma segunda via da requisição de exames/procedimentos?
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setDialog(null)}
                                        className="px-4 py-2 rounded-lg border"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={abrirRequisicaoExames}
                                        disabled={gerandoRequisicao}
                                        className="px-4 py-2 rounded-lg bg-green-700 text-white disabled:opacity-50"
                                    >
                                        {gerandoRequisicao ? "Gerando..." : "Gerar PDF"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <iframe
                                src={urlRequisicao}
                                className="w-full h-[75vh] border rounded"
                                title="Requisição de Exames"
                            />
                        )}
                    </div>
                )}
            </Dialog>

            <DialogPersonalizado
                visivel={dialogConfirmacao}
                titulo="Confirmar cadastro"
                mensagem="Deseja realmente cadastrar este encaminhamento?"
                textoConfirmar="Cadastrar"
                aoConfirmar={criarEncaminhamento}
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
        </Template >
    )
}