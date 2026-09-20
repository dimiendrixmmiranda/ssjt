'use client'

import { Local, Medico, Paciente, Prestador, TipoEspecialidade } from "@/app/generated/prisma/client";
import InputCheckbox from "@/components/assets/inputs/InputCheckbox";
import InputData from "@/components/assets/inputs/InputData";
import InputSelect from "@/components/assets/inputs/InputSelect";
import { useAgendamentos } from "@/hooks/useAgendamento";
import { useEspecialidades } from "@/hooks/useEspecialidades";
import { useLocaisDeAtendimento } from "@/hooks/useLocaisDeAtendimento";
import { useMedicos } from "@/hooks/useMedicos";
import { usePacientes } from "@/hooks/usePacientes";
import { useProcedimentos } from "@/hooks/useProcedimentos";
import { Dialog } from "primereact/dialog";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useRef, useState } from "react";
import { AiOutlineMedicineBox, AiOutlineSelect } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { FaClockRotateLeft, FaHandHoldingMedical, FaListCheck, FaPlus, FaRegLightbulb, FaSourcetree, FaUserPen } from "react-icons/fa6";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { IoMapSharp } from "react-icons/io5";
import { LiaProceduresSolid } from "react-icons/lia";
import { MdChevronLeft, MdChevronRight, MdCopyAll, MdDriveFileRenameOutline, MdOutlineMedicalInformation, MdTableRows } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TiUserDelete } from "react-icons/ti";
import { LuMinus } from "react-icons/lu";
import { RxRows } from "react-icons/rx";
import { TbFilterCog, TbPhoneCalling, TbUrgent } from "react-icons/tb";
import InputTexto from "@/components/assets/inputs/InputTexto";
import MenuContextoPaciente from "@/components/assets/contextoDeAtendimento/ContextoDeAtendimento";
import FormIncluirAgendamento from "@/components/formularios/FormIncluirAgendamento";
import Image from "next/image";
import { usePrestadores } from "@/hooks/usePrestadores";
import { copiarTexto } from "@/lib/utils";
import { useDialog } from "@/context/DialogContext";

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


export default function Atendimentos() {
    const { agendamentos, buscarAgendamentos } = useAgendamentos()
    const { abrirDialog } = useDialog()
    const [buttonActive, setButtonActive] = useState<'TODOS' | 'CONSULTA' | 'PROCEDIMENTO' | 'CIRURGIA'>('TODOS')

    const normalizarTexto = (texto: string) =>
        texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim()

    const { pacientes } = usePacientes()
    const { locais } = useLocaisDeAtendimento()
    const { medicos } = useMedicos()
    const { especialidades } = useEspecialidades()
    const { prestadores } = usePrestadores()
    const [visible, setVisible] = useState(false);
    const [buscarPaciente, setBuscarPaciente] = useState('')
    // Origem
    const [pacienteAtual, setPacienteAtual] = useState<Paciente | null>(null)
    const [botaoAdicionarConsultaProcedimento, setBotaoAdicionarConsultaProcedimento] = useState<"CONSULTA" | "PROCEDIMENTO">("CONSULTA")


    const pacientesFiltrados = pacientes.filter((paciente) => {
        if (!buscarPaciente.trim()) return false
        const busca = buscarPaciente.toLowerCase().trim()
        return (
            paciente.nome.toLowerCase().includes(busca) ||
            paciente.cpf?.includes(busca) ||
            paciente.cartaoSus?.includes(busca)
        )
    }).slice(0, 8)

    // origem
    const [unidadeDeOrigem, setUnidadeDeOrigem] = useState<Local | null>(null)
    const locaisJoaquimTavora = locais.filter(local => local.cep === '86455-000')
    const [dataDeEntrada, setDataDeEntrada] = useState(
        new Date().toISOString().split('T')[0]
    )
    const [medicoSolicitante, setMedicoSolicitante] = useState<Medico | null>(null)
    const [buscaMedicoSolicitante, setBuscarMedicoSolicitante] = useState('')
    const opcoesUnidadesDeOrigem = [
        {
            label: 'Selecione',
            valor: ''
        },
        ...locaisJoaquimTavora.map(local => ({
            label: local.nome,
            valor: local.id.toString()
        }))
    ]
    const [especialidadeDoPrestador, setEspecialidadeDoPrestador] = useState<string>('')
    const opcoesEspecialidade = [
        {
            valor: '',
            label: "Selecione"
        },
        ...especialidades
            .filter((esp) => esp.id === medicoSolicitante?.especialidadeId)
            .map((esp) => ({
                valor: esp.id.toString(),
                label: esp.nome
            }))
    ]

    // Destino
    const [tipoDeAtendimento, setTipoDeAtendimento] = useState('')
    const opcoesTipoAtendimento = [
        { label: 'Selecione', valor: '' },
        { label: 'Normal', valor: 'NORMAL' },
        { label: 'TFD', valor: 'TFD' },
    ]

    const [especialidadeEncaminhada, setEspecialidadeEncaminhada] =
        useState<number | null>(null)
    const [buscarEspecialidadeEncaminhada, setBuscarEspecialidadeEncaminhada] =
        useState('')
    const [procedimentoFilho, setProcedimentoFilho] =
        useState<number | null>(null)
    const [buscarEspecialidadeFilha, setBuscarEspecialidadeFilha] =
        useState('')
    const especialidadesEncaminhadasFiltradas = especialidades
        .filter((especialidade) => {
            if (tipoDeAtendimento === 'TFD') {
                return especialidade.tipo === 'TFD'
            }

            if (tipoDeAtendimento === 'NORMAL') {
                return especialidade.tipo === 'NORMAL'
            }

            return false
        })
        .filter((especialidade) =>
            normalizarTexto(especialidade.nome).includes(
                normalizarTexto(buscarEspecialidadeEncaminhada)
            )
        )
    const especialidadesFilhasFiltradas =
        especialidades
            .find(esp => esp.id === especialidadeEncaminhada)
            ?.filhas
            ?.filter((filha) =>
                normalizarTexto(filha.nome).includes(
                    normalizarTexto(buscarEspecialidadeFilha)
                )
            ) ?? []

    const medicosSolicitadosFiltrados = medicos.filter((medico) =>
        normalizarTexto(medico.nome).includes(
            normalizarTexto(buscaMedicoSolicitante)
        )
    )
    const [situacao, setSituacao] = useState('')
    const opcoesDeSituacao = [
        {
            valor: '',
            label: 'Selecione'
        },
        {
            valor: 'URGENTE',
            label: 'Urgente'
        },
        {
            valor: 'PRIORIDADE',
            label: 'Prioridade'
        },
        {
            valor: 'NORMAL',
            label: 'Normal'
        },
    ]

    const [tipoDeConsulta, setTipoDeConsulta] = useState('')
    const opcoesTipoDeConsulta = [
        {
            valor: '',
            label: 'Selecione'
        },
        {
            valor: 'PRIMEIRA_CONSULTA',
            label: '1º Consulta'
        },
        {
            valor: 'RETORNO',
            label: 'Retorno'
        },
    ]

    const [condicaoDeRetorno, setCondicaoDeRetorno] = useState('')
    const opcoesCondicaoDeRetorno = [
        {
            label: 'Selecione',
            valor: ''
        },
        {
            label: 'Com exames prontos',
            valor: 'COM_EXAMES_PRONTOS'
        },
        {
            label: 'Determinado periodo de tempo',
            valor: 'DETERMINADO_PERIODO_DE_TEMPO'
        },

    ]
    const [dataDoRetorno, setDataDoRetorno] = useState('')


    const { procedimentos } = useProcedimentos()
    const [procedimentoSelecionado, setProcedimentoSelecionado] =
        useState<number | null>(null)

    const [buscarProcedimento, setBuscarProcedimento] = useState('')

    const [procedimentoFilhoSelecionado, setProcedimentoFilhoSelecionado] =
        useState<number | null>(null)

    const [buscarProcedimentoFilho, setBuscarProcedimentoFilho] =
        useState('')

    const procedimentosFiltrados = procedimentos.filter((procedimento) =>
        normalizarTexto(procedimento.nome).includes(
            normalizarTexto(buscarProcedimento)
        )
    )

    const procedimentosFilhosFiltrados =
        procedimentos
            .find(
                procedimento =>
                    procedimento.id === procedimentoSelecionado
            )
            ?.filhas
            ?.filter((filha) =>
                normalizarTexto(filha.nome!).includes(
                    normalizarTexto(buscarProcedimentoFilho)
                )
            ) ?? []

    const [lado, setLado] = useState('')
    const opcoesDeLado = [
        {
            valor: '',
            label: 'Selecione'
        },
        {
            valor: 'DIREITO',
            label: 'Direito'
        },
        {
            valor: 'ESQUERDO',
            label: 'Esquerdo'
        },
        {
            valor: 'SUPERIOR',
            label: 'Superior'
        },
        {
            valor: 'INFERIOR',
            label: 'Inferior'
        },
    ]
    const [encaminhamentoRemarcado, setEncaminhamentoRemarcado] = useState(false)

    const limparFormualario = () => {
        setPacienteAtual(null)
        setBuscarPaciente("")

        setUnidadeDeOrigem(null)

        setMedicoSolicitante(null)
        setBuscarMedicoSolicitante("")

        setEspecialidadeDoPrestador("")

        setTipoDeAtendimento("")

        setEspecialidadeEncaminhada(null)
        setBuscarEspecialidadeEncaminhada("")

        setEspecialidadeEncaminhada(null)
        setBuscarEspecialidadeEncaminhada("")

        setProcedimentoFilho(null)
        setBuscarEspecialidadeFilha("")

        setTipoDeConsulta("")

        setSituacao("")
        setCondicaoDeRetorno("")
        setDataDoRetorno("")

        setProcedimentoSelecionado(null)
        setBuscarProcedimento("")

        setProcedimentoFilhoSelecionado(null)
        setBuscarProcedimentoFilho("")

        setLado("")

        setEncaminhamentoRemarcado(false)

        setVisible(false)

    }

    const handleAdicionarAgendamento = async () => {
        try {
            if (!pacienteAtual) {
                alert("Selecione um paciente.")
                return
            }

            if (!unidadeDeOrigem) {
                alert("Selecione a unidade de origem.")
                return
            }

            if (!dataDeEntrada) {
                alert("Informe a data de entrada.")
                return
            }

            if (!situacao) {
                alert("Informe a situação/prioridade.")
                return
            }

            const dadosAgendamento = {
                // Tipo
                tipo: botaoAdicionarConsultaProcedimento,

                // Paciente
                pacienteId: pacienteAtual.id,

                // Unidade que originou
                unidadeDeOrigemId: unidadeDeOrigem.id,

                // Entrada na fila
                dataDeEntrada: `${dataDeEntrada}T00:00:00`,

                // Médico solicitante
                medicoSolicitanteId: medicoSolicitante?.id ?? null,

                // =========================
                // CONSULTA
                // =========================

                especialidadeId:
                    botaoAdicionarConsultaProcedimento === "CONSULTA"
                        ? especialidadeEncaminhada
                        : null,

                especialidadeFilhaId:
                    botaoAdicionarConsultaProcedimento === "CONSULTA"
                        ? procedimentoFilho
                        : null,

                tipoDeConsulta:
                    botaoAdicionarConsultaProcedimento === "CONSULTA"
                        ? tipoDeConsulta || null
                        : null,

                // =========================
                // PROCEDIMENTO
                // =========================

                procedimentoId:
                    botaoAdicionarConsultaProcedimento === "PROCEDIMENTO"
                        ? procedimentoSelecionado
                        : null,

                procedimentoFilhoId:
                    botaoAdicionarConsultaProcedimento === "PROCEDIMENTO"
                        ? procedimentoFilhoSelecionado
                        : null,

                lado:
                    botaoAdicionarConsultaProcedimento === "PROCEDIMENTO"
                        ? lado || null
                        : null,

                // =========================
                // PRIORIDADE
                // =========================

                prioridade: situacao,

                // =========================
                // RETORNO
                // =========================

                condicaoDeRetorno:
                    botaoAdicionarConsultaProcedimento === "CONSULTA"
                        ? condicaoDeRetorno || null
                        : null,

                dataDoRetorno:
                    botaoAdicionarConsultaProcedimento === "CONSULTA" &&
                        dataDoRetorno
                        ? `${dataDoRetorno}T00:00:00`
                        : null,

                // =========================
                // REMARCAÇÃO
                // =========================

                encaminhamentoRemarcado,

                // =========================
                // STATUS
                // =========================

                status: "EM_ESPERA",

                // Ainda não foi colocado na agenda
                dataDoAgendamento: null,

                // =========================
                // ATIVO
                // =========================

                ativo: true,
            }

            console.log("DADOS ENVIADOS:", dadosAgendamento)

            const resposta = await fetch("/api/agendamento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosAgendamento),
            })

            const dados = await resposta.json()

            console.log("RESPOSTA DA API:", dados)

            if (!resposta.ok) {
                alert(
                    dados.erro ||
                    "Não foi possível criar o agendamento."
                )
                return
            }

            abrirDialog({
                title: `Sucesso!`,
                message: `${botaoAdicionarConsultaProcedimento} foi cadastrado com sucesso.`,
            })

            console.log("AGENDAMENTO CRIADO:", dados)
            await buscarAgendamentos()

            // =========================
            // LIMPAR FORMULÁRIO
            // =========================
            limparFormualario()

        } catch (erro) {
            console.error(
                "Erro ao adicionar agendamento:",
                erro
            )

            alert("Erro ao conectar com o servidor.")
        }
    }

    const [first, setFirst] = useState(0)
    const [rows] = useState(7)

    const opcoesCampoDeBusca = [
        {
            valor: 'NOME',
            label: "Nome",
        },
        {
            valor: 'CPF',
            label: "CPF",
        },
        {
            valor: 'CARTAO_SUS',
            label: "Cartão SUS",
        },
    ]

    const [campoDeBusca, setCampoDeBusca] = useState('')

    const [buscaRealizada, setBuscaRealizada] = useState(false)

    const opcoesStatusDeAgendamento = [
        {
            valor: '',
            label: "Selecione",
        },
        {
            valor: 'EM_ESPERA',
            label: "Em Espera",
        },
        {
            valor: 'AGENDADO',
            label: "Agendado",
        },
        {
            valor: 'BLOQUEADO',
            label: "Bloqueado",
        },
        {
            valor: 'TIRADO_DA_FILA',
            label: "Tirado da fila",
        },
    ]

    const [statusDeAgendamento, setStatusDeAgendamento] = useState('')

    const [unidadeDoClienteBusca, setUnidadeDoClienteBusca] = useState('')

    const opcoesUnidadesDoCliente = [
        {
            label: "Selecione",
            valor: ''
        },
        ...locaisJoaquimTavora.map(local => ({
            label: local.nome,
            valor: String(local.id)
        }))
    ]

    const [valorDaBusca, setValorDaBusca] = useState('')

    const [menuContexto, setMenuContexto] = useState<{
        x: number
        y: number
        atendimento: typeof agendamentos[number]
    } | null>(null)

    const [dialog, setDialog] = useState<{
        tipo: AcaoPaciente
        agendamento: any
    } | null>(null)

    const handleAction = (acao: AcaoPaciente, agendamento: any) => {
        setMenuContexto(null)

        setDialog({
            tipo: acao,
            agendamento
        })
    }
    const tabelaRef = useRef<HTMLDivElement>(null);

    const rolarTabela = (direcao: "esquerda" | "direita") => {
        if (!tabelaRef.current) return;
        tabelaRef.current.scrollBy({
            left: direcao === "direita" ? 300 : -300,
            behavior: "smooth",
        });
    };


    const agendamentosPesquisados = agendamentos.filter((agendamento) => {
        if (!buscaRealizada) {
            return false
        }

        // Status
        if (
            statusDeAgendamento &&
            agendamento.status !== statusDeAgendamento
        ) {
            return false
        }

        // Unidade
        if (
            unidadeDoClienteBusca &&
            String(agendamento.unidadeDeOrigemId) !== unidadeDoClienteBusca
        ) {
            return false
        }

        // Nome / CPF / Cartão SUS
        if (campoDeBusca && valorDaBusca.trim()) {
            const busca = normalizarTexto(valorDaBusca)

            if (campoDeBusca === 'NOME') {
                return normalizarTexto(agendamento.paciente.nome)
                    .includes(busca)
            }

            if (campoDeBusca === 'CPF') {
                return agendamento.paciente.cpf?.includes(
                    valorDaBusca.trim()
                ) ?? false
            }

            if (campoDeBusca === 'CARTAO_SUS') {
                return agendamento.paciente.cartaoSus?.includes(
                    valorDaBusca.trim()
                ) ?? false
            }
        }

        return true
    })


    const agendamentosFiltrados = agendamentosPesquisados.filter((agendamento) => {
        if (buttonActive === 'TODOS') {
            return true
        }

        if (buttonActive === 'CONSULTA') {
            return agendamento.tipo === 'CONSULTA' && agendamento.especialidade?.tipo === 'NORMAL'
        }

        if (buttonActive === 'PROCEDIMENTO') {
            return agendamento.tipo === 'PROCEDIMENTO'
        }
        if (buttonActive === 'CIRURGIA') {
            return agendamento.tipo === 'CONSULTA' && agendamento.especialidade?.tipo === 'TFD'
        }

        return true
    })

    const buscaAgendamentosPaginados = agendamentosFiltrados.slice(
        first,
        first + rows
    )

    const handleBuscar = () => {
        setFirst(0)
        setBuscaRealizada(true)
    }

    console.log(agendamentos)
    console.log(procedimentoFilhoSelecionado)
    
    return (
        <>
            <div className="p-4 flex flex-col gap-4 row-span-2 h-full">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center my-auto gap-2 text-verde-escuro">
                        <AiOutlineMedicineBox className="text-5xl" />
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold">Agendamento</h3>
                            <p className="-mt-1">Busque informações entre Consultas, Procedimentos e Cirurgias</p>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => setVisible(true)} className="flex items-center gap-2 rounded-lg px-4 h-[45px] bg-verde-escuro text-white font-bold">
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
                                <InputTexto icone={<MdDriveFileRenameOutline />} id="valor" label="Valor" nome="valor" placeholder="valor..." setValor={setValorDaBusca} valor={valorDaBusca} />
                                <button
                                    type="button"
                                    onClick={handleBuscar}
                                    className="font-bold bg-verde text-white h-fit mt-auto py-2 px-5 rounded-lg hover:bg-verde-escuro transition-all"
                                >
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Filtros por tipo */}
                    <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg py-2 px-4 gap-3 relative flex justify-between">
                        <div className="flex items-center">
                            <button onClick={() => setButtonActive('TODOS')} className={`p-3 font-bold ${buttonActive === 'TODOS' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}>
                                <p>Todos</p>
                            </button>
                            <button onClick={() => setButtonActive('CONSULTA')} className={`p-3 font-bold ${buttonActive === 'CONSULTA' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}>
                                <p>Consultas</p>
                            </button>
                            <button onClick={() => setButtonActive('PROCEDIMENTO')} className={`p-3 font-bold ${buttonActive === 'PROCEDIMENTO' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}>
                                <p>Procedimento</p>
                            </button>
                            <button onClick={() => setButtonActive('CIRURGIA')} className={`p-3 font-bold ${buttonActive === 'CIRURGIA' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}>
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
                        buscaAgendamentosPaginados.length > 0 ? (
                            <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg py-2 px-4 flex flex-col gap-3 h-full relative">
                                {/* Tabela */}
                                <div className="flex flex-col h-full overflow-hidden">
                                    <div className="w-full overflow-x-auto teste pb-2 h-full" ref={tabelaRef}>
                                        <div className="min-w-[2480px]">
                                            <ul className="grid grid-cols-[50px_100px_200px_230px_200px_300px_200px_200px_200px_200px_200px_200px_200px] w-full font-bold border-b">
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
                                                    <p>Data de Nascimento</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Especialidade/Procedimento</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Situação</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Médico Solicitante</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Data de Saída</p>
                                                </li>
                                                <li className="flex justify-center items-center py-2 border border-zinc-900 bg-verde-escuro text-white">
                                                    <p>Contato</p>
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
                                                                buscaAgendamentosPaginados.map((agendamento, i) => {
                                                                    const localDeAtendimento = locais.find(local => local.id === agendamento.localDeAtendimentoId)
                                                                    const prestador = prestadores.find(prestador => prestador.id === agendamento.prestadorId)

                                                                    console.log(agendamento)
                                                                    return (
                                                                        <li key={i}
                                                                            onContextMenu={(e) => {
                                                                                e.preventDefault()
                                                                                setMenuContexto({
                                                                                    x: e.clientX,
                                                                                    y: e.clientY - 200,
                                                                                    atendimento: agendamento,
                                                                                })
                                                                            }}
                                                                            className={`
                                                                                grid grid-cols-[50px_100px_200px_230px_200px_300px_200px_200px_200px_200px_200px_200px_200px] w-full border-b items-center py-2
                                                                                ${agendamento.especialidade?.tipo === 'TFD' ? 'bg-blue-200' : ''}
                                                                                ${agendamento.especialidade?.tipo === 'NORMAL' ? 'bg-green-200' : ''}
                                                                                ${agendamento.tipo === 'PROCEDIMENTO' ? 'bg-orange-200' : ''}
                                                                                cursor-pointer
                                                                                border-l border-r border-zinc-700
                                                                            `}>
                                                                            <div className="flex justify-center items-center relative gap-1">
                                                                                <div className="relative group">
                                                                                    {agendamento.prioridade === "URGENTE" && (
                                                                                        <div className="text-amber-500 bg-white flex justify-center items-center h-8 w-8 rounded-full shadow-[0px_0px_1px_black] cursor-help">
                                                                                            <RxRows />
                                                                                        </div>
                                                                                    )}
                                                                                    {agendamento.prioridade === "PRIORIDADE" && (
                                                                                        <div className="text-amber-500 bg-white flex justify-center items-center h-8 w-8 rounded-full shadow-[0px_0px_1px_black] cursor-help">
                                                                                            <MdTableRows />
                                                                                        </div>
                                                                                    )}
                                                                                    {agendamento.prioridade === "NORMAL" && (
                                                                                        <div className="text-zinc-700 bg-white flex justify-center items-center h-8 w-8 rounded-full shadow-[0px_0px_1px_black] cursor-help">
                                                                                            <LuMinus />
                                                                                        </div>
                                                                                    )}
                                                                                    {/* TOOLTIP */}
                                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[999] whitespace-nowrap">
                                                                                        <div className="bg-zinc-800 text-white text-[.5em] font-medium px-2 py-1 rounded-md  shadow-lg">
                                                                                            {agendamento.prioridade}
                                                                                        </div>
                                                                                        {/* SETINHA */}
                                                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-800" />
                                                                                    </div>
                                                                                </div>
                                                                                {agendamento.encaminhamentoRemarcado && (
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
                                                                                <p className="cursor-auto">{agendamento.paciente.codigoIds}</p>
                                                                                <div className="absolute -top-2 right-0">
                                                                                    <button onClick={() => copiarTexto(agendamento.paciente.codigoIds)}>
                                                                                        <MdCopyAll />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p>
                                                                                    {new Date(agendamento.createdAt).toISOString().split("T")[0].split("-").reverse().join("/")}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p>{agendamento.paciente.nome}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p>
                                                                                    {new Date(agendamento.paciente.dataDeNascimento).toISOString().split("T")[0].split("-").reverse().join("/")}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                {
                                                                                    agendamento.tipo === 'CONSULTA' ? (
                                                                                        <p>{`${agendamento.especialidade?.nome} ${agendamento.especialidadeFilha ? ` - ${agendamento.especialidadeFilha.nome}` : ''}`}</p>
                                                                                    ) : ('')
                                                                                }
                                                                                {
                                                                                    agendamento.tipo === 'PROCEDIMENTO' ? (
                                                                                        <p>{`${agendamento.procedimento?.nome} ${agendamento.procedimentoFilho ? ` - ${agendamento.procedimentoFilho.nome}` : ''}`}</p>
                                                                                    ) : ('')
                                                                                }
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize">{agendamento.status.replaceAll('_', ' ').toLowerCase()}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize">{agendamento.medicoSolicitante?.nome}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize">{agendamento.dataDeSaida ? new Date(agendamento.dataDeSaida).toISOString().split("T")[0].split("-").reverse().join("/") : '—'}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center relative">
                                                                                <p className="capitalize">{agendamento.paciente.telefone1}</p>
                                                                                <a
                                                                                    href={`https://wa.me/55${agendamento.paciente.telefone1.replace(/\D/g, '')}`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="absolute -top-1 right-2"
                                                                                >
                                                                                    <TbPhoneCalling />
                                                                                </a>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize">{agendamento.dataDoAgendamento ? new Date(agendamento.dataDoAgendamento).toISOString().split("T")[0].split("-").reverse().join("/") : '—'}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize">{localDeAtendimento?.nome || '—'}</p>
                                                                            </div>
                                                                            <div className="flex justify-center items-center">
                                                                                <p className="capitalize">{prestador?.nome || '—'}</p>
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
                                        <p className="my-auto">Mostrando 1 a 6 de 6 registros</p>
                                        <Paginator
                                            first={first}
                                            rows={rows}
                                            totalRecords={agendamentosFiltrados.length}
                                            onPageChange={(event: PaginatorPageChangeEvent) => {
                                                setFirst(event.first)
                                            }}
                                            className="my-auto"
                                        />
                                    </div>
                                </div>

                                {/* Arrows de navegação */}
                                <button
                                    type="button"
                                    onClick={() => rolarTabela("esquerda")}
                                    className="
                                        absolute left-2 top-1/2 -translate-y-1/2 z-10
                                        flex items-center justify-center
                                        w-8 h-8
                                        rounded-full
                                        bg-white/90
                                        border border-zinc-300
                                        text-zinc-600
                                        shadow-sm
                                        hover:bg-zinc-100
                                        hover:text-verde-escuro
                                        transition-all
                                    "
                                    aria-label="Rolar tabela para esquerda"
                                >
                                    <MdChevronLeft size={24} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => rolarTabela("direita")}
                                    className="
                                        absolute right-2 top-1/2 -translate-y-1/2 z-10
                                        flex items-center justify-center
                                        w-8 h-8
                                        rounded-full
                                        bg-white/90
                                        border border-zinc-300
                                        text-zinc-600
                                        shadow-sm
                                        hover:bg-zinc-100
                                        hover:text-verde-escuro
                                        transition-all
                                    "
                                    aria-label="Rolar tabela para direita"
                                >
                                    <MdChevronRight size={24} />
                                </button>
                            </div>
                        ) : (
                            <div className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg shadow-[0px_0px_2px_1px_var(--verde-escuro)] overflow-hidden h-full">
                                <div className="relative w-[300px] h-[300px]">
                                    <Image alt="Lupa de pesquisa" src={'/assets/lupa-pacientes.png'} fill className="object-contain" />
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                    <h3 className="font-bold text-2xl">Pesquise um paciente para começar</h3>
                                    <p>Informe o nome, data de nascimento, cpf ou cartão SUS para visualizar os resultados encontrados.</p>
                                </div>
                                <div className="relative flex items-center gap-2 p-2 rounded-lg shadow-[0px_0px_2px_1px_var(--verde-escuro)] overflow-hidden mt-4">
                                    <FaRegLightbulb className="text-verde-escuro" />
                                    <p>Você vera somente os pacientes correspondentes à sua busca.</p>
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
            {
                <Dialog
                    header={
                        <div>
                            <h2>Nova Consulta/Procedimento/Cirurgia</h2>
                        </div>
                    }
                    visible={visible}
                    className="max-w-[95%] w-full 2xl:max-w-[1200px]"
                    onHide={() => {
                        if (!visible) return
                        setVisible(false)
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
                                            ? pacienteAtual.nome
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
                                                                paciente.unidadeDeSaude !== null &&
                                                                local.id === Number(paciente.unidadeDeSaude)
                                                        )
                                                        localPacienteSelecionado && setUnidadeDeOrigem(localPacienteSelecionado)
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-zinc-100 transition"
                                                >
                                                    <p className="font-semibold text-zinc-800">
                                                        {paciente.nome}
                                                    </p>
                                                    <div className="flex gap-4 text-xs text-zinc-500 mt-1">
                                                        <span>
                                                            CPF: {paciente.cpf}
                                                        </span>
                                                        <span>
                                                            CNS: {paciente.cartaoSus}
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
                                            <ul className="grid grid-cols-4 w-full gap-2">
                                                <li className="flex items-center gap-2">
                                                    <span>Nome:</span>
                                                    <p className="line-clamp-1">{pacienteAtual?.nome}</p>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span>Sexo:</span>
                                                    <p>{pacienteAtual?.sexo}</p>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span>CEP:</span>
                                                    <p>{pacienteAtual?.cep}</p>
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
                                                    <p>{pacienteAtual?.cpf}</p>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span>CNS:</span>
                                                    <p>{pacienteAtual?.cpfCns}</p>
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
                                                    <p>{pacienteAtual?.unidadeDeSaude}</p>
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

                            {/* Selecionar entre Consulta e Exames */}
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
                                        {!medicoSolicitante &&
                                            buscaMedicoSolicitante.trim() !== '' && (
                                                <div
                                                    className="
                                                    absolute
                                                    top-full
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
                                                "
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
                                                                id="categoriaDeAtendimento"
                                                                label="Categoria de Atendimento"
                                                                nome="categoriaDeAtendimento"
                                                                setValor={(valor) => {
                                                                    setTipoDeAtendimento(valor)

                                                                    // Ao trocar o tipo, limpa a especialidade selecionada
                                                                    setEspecialidadeEncaminhada(null)
                                                                    setBuscarEspecialidadeEncaminhada('')

                                                                    // Limpa a especialidade filha
                                                                    setProcedimentoFilho(null)
                                                                    setBuscarEspecialidadeFilha('')
                                                                }}
                                                                valor={tipoDeAtendimento}
                                                                opcoes={opcoesTipoAtendimento}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Tipo de consulta */}
                                                    <div className={`mt-auto ${tipoDeAtendimento === 'PROCEDIMENTO' ? 'opacity-20' : ''}`}>
                                                        <InputSelect
                                                            icone={<AiOutlineSelect />}
                                                            id="tipoDeConsulta"
                                                            label="Tipo de Consulta"
                                                            nome="tipoDeConsulta"
                                                            setValor={setTipoDeConsulta}
                                                            valor={tipoDeConsulta}
                                                            opcoes={opcoesTipoDeConsulta}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Especialidade */}
                                                <div className="flex flex-col relative">
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
                                                {/* Especialidade filha */}
                                                <div className="flex flex-col gap-1 relative">
                                                    <label
                                                        htmlFor="buscarEspecialidadeFilha"
                                                        className="font-semibold text-zinc-700"
                                                    >
                                                        Especialidade filha:
                                                    </label>

                                                    <input
                                                        id="buscarEspecialidadeFilha"
                                                        type="text"
                                                        value={
                                                            procedimentoFilho
                                                                ? especialidades
                                                                    .find(esp => esp.id === especialidadeEncaminhada)
                                                                    ?.filhas?.find(
                                                                        filha => filha.id === procedimentoFilho
                                                                    )?.nome ?? ''
                                                                : buscarEspecialidadeFilha
                                                        }
                                                        onChange={(e) => {
                                                            setBuscarEspecialidadeFilha(e.target.value)
                                                            setProcedimentoFilho(null)
                                                        }}
                                                        placeholder="Digite a especialidade..."
                                                        autoComplete="off"
                                                        className="w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-verde focus:ring-1 focus:ring-verde"
                                                    />

                                                    {!procedimentoFilho &&
                                                        buscarEspecialidadeFilha.trim() !== '' && (
                                                            <div
                                                                className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden "
                                                            >
                                                                {especialidadesFilhasFiltradas.length > 0 ? (
                                                                    especialidadesFilhasFiltradas.map((filha) => (
                                                                        <button
                                                                            type="button"
                                                                            key={filha.id}
                                                                            onClick={() => {
                                                                                setProcedimentoFilho(filha.id)
                                                                                setBuscarEspecialidadeFilha('')
                                                                            }}
                                                                            className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-zinc-100 transition"
                                                                        >
                                                                            <p className="font-semibold text-zinc-800">
                                                                                {filha.nome}
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
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Situação */}
                                                    <div className="flex flex-col gap-1 relative">
                                                        <InputSelect
                                                            icone={<AiOutlineSelect />}
                                                            id="situacao"
                                                            label="Situação"
                                                            nome="situacao"
                                                            setValor={setSituacao}
                                                            valor={situacao}
                                                            opcoes={opcoesDeSituacao}
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
                                                {/* Condição de retorno */}
                                                <div className={`${tipoDeConsulta === 'PRIMEIRA_CONSULTA' ? 'opacity-30' : ''}`}>
                                                    <InputSelect
                                                        icone={<AiOutlineSelect />}
                                                        id="condicaoDeRetorno"
                                                        label="Condição de Retorno"
                                                        nome="condicaoDeRetorno"
                                                        setValor={setCondicaoDeRetorno}
                                                        valor={condicaoDeRetorno}
                                                        opcoes={opcoesCondicaoDeRetorno}
                                                        disabled={tipoDeConsulta === 'PRIMEIRA_CONSULTA' ? true : false}
                                                    />
                                                </div>
                                                {/* Data de retorno */}
                                                <div className={`${tipoDeConsulta === 'PRIMEIRA_CONSULTA' ? 'opacity-30' : ''}`}>
                                                    <InputData icone={<HiOutlineCalendarDateRange />} id="dataDoRetorno" label="Data do Retorno" nome="dataDoRetorno" placeholder="Data do Retorno" setValor={setDataDoRetorno} valor={dataDoRetorno} disabled={tipoDeConsulta === 'PRIMEIRA_CONSULTA' ? true : false}
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

                                                        // limpa o filho ao trocar o procedimento pai
                                                        setProcedimentoFilhoSelecionado(null)
                                                        setBuscarProcedimentoFilho('')
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
                                                                            setProcedimentoSelecionado(
                                                                                procedimento.id
                                                                            )

                                                                            setBuscarProcedimento('')

                                                                            setProcedimentoFilhoSelecionado(null)
                                                                            setBuscarProcedimentoFilho('')
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

                                            {/* PROCEDIMENTO FILHO */}
                                            <div className="flex flex-col gap-1 relative">
                                                <label
                                                    htmlFor="buscarProcedimentoFilho"
                                                    className="font-semibold text-zinc-700"
                                                >
                                                    Procedimento específico
                                                </label>
                                                <input
                                                    id="buscarProcedimentoFilho"
                                                    type="text"
                                                    disabled={!procedimentoSelecionado}
                                                    value={
                                                        procedimentoFilhoSelecionado
                                                            ? procedimentos
                                                                .find(
                                                                    procedimento =>
                                                                        procedimento.id === procedimentoSelecionado
                                                                )
                                                                ?.filhas
                                                                ?.find(
                                                                    filha =>
                                                                        filha.id === procedimentoFilhoSelecionado
                                                                )
                                                                ?.nome ?? ''
                                                            : buscarProcedimentoFilho
                                                    }
                                                    onChange={(e) => {
                                                        setBuscarProcedimentoFilho(e.target.value)
                                                        setProcedimentoFilhoSelecionado(null)
                                                    }}
                                                    placeholder={
                                                        procedimentoSelecionado
                                                            ? "Digite o procedimento específico..."
                                                            : "Selecione primeiro o procedimento"
                                                    }
                                                    autoComplete="off"
                                                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-verde focus:ring-1 focus:ring-verde disabled:bg-zinc-100 disabled:cursor-not-allowed "
                                                />
                                                {procedimentoSelecionado &&
                                                    !procedimentoFilhoSelecionado &&
                                                    buscarProcedimentoFilho.trim() !== '' && (

                                                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden">
                                                            {procedimentosFilhosFiltrados.length > 0 ? (
                                                                procedimentosFilhosFiltrados.map((filha) => (
                                                                    <button
                                                                        type="button"
                                                                        key={filha.id}
                                                                        onClick={() => {
                                                                            setProcedimentoFilhoSelecionado(
                                                                                filha.id
                                                                            )

                                                                            setBuscarProcedimentoFilho('')
                                                                        }}
                                                                        className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-zinc-100 transition"
                                                                    >
                                                                        <p className="font-semibold text-zinc-800">
                                                                            {filha.nome}
                                                                        </p>
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <div className="px-4 py-3 text-sm text-zinc-500">
                                                                    Nenhum procedimento específico encontrado.
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                            </div>

                                            {/* Definir lado do membro */}
                                            <div className="flex flex-col gap-1 relative">
                                                <InputSelect
                                                    icone={<AiOutlineSelect />}
                                                    id="lado"
                                                    label="Lado"
                                                    nome="lado"
                                                    setValor={setLado}
                                                    valor={lado}
                                                    opcoes={opcoesDeLado}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Situação */}
                                                <div className="flex flex-col gap-1 relative">
                                                    <InputSelect
                                                        icone={<AiOutlineSelect />}
                                                        id="situacao"
                                                        label="Situação"
                                                        nome="situacao"
                                                        setValor={setSituacao}
                                                        valor={situacao}
                                                        opcoes={opcoesDeSituacao}
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
                                    onClick={limparFormualario}
                                    className="flex items-center gap-2 rounded-lg px-4 h-[45px] bg-white text-red-600 border border-red-600 font-bold text-xl"
                                >
                                    <FaPlus />
                                    <p>Cancelar</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAdicionarAgendamento}
                                    className="flex items-center gap-2 rounded-lg px-4 h-[45px] border border-verde bg-verde-escuro text-white font-bold text-xl"
                                >
                                    <FaPlus />
                                    <p>Adicionar</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            }
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
                                : "Ação"
                }
                visible={dialog !== null}
                onHide={() => setDialog(null)}
                className="w-full max-w-[1000px]"
            >
                {dialog?.tipo === "agendamento" && (
                    <FormIncluirAgendamento
                        agendamento={dialog.agendamento}
                        onClose={() => setDialog(null)}
                        onAgendamentoSalvo={() => {
                            buscarAgendamentos()
                        }}
                    />
                )}

                {/* {dialog?.tipo === "alterar" && (
                    <FormAlterarAgendamento
                        paciente={dialog.paciente}
                        onClose={() => setDialog(null)}
                    />
                )}

                {dialog?.tipo === "historico" && (
                    <HistoricoPaciente
                        paciente={dialog.paciente}
                    />
                )} */}
            </Dialog>

        </>
    )
}