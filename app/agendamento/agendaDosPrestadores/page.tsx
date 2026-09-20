'use client'

import { useEffect, useMemo, useState } from "react"
import { Dialog } from "primereact/dialog"
import { GiCancel } from "react-icons/gi";

import {
    FaListCheck,
    FaRegBuilding,
    FaRegClock,
    FaUser,
    FaUsers,
} from "react-icons/fa6"

import {
    HiOutlineLocationMarker,
} from "react-icons/hi"

import {
    IoCalendarOutline,
    IoMapSharp,
    IoWarningOutline,
} from "react-icons/io5"

import {
    FaRegCalendarAlt,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa"

import { useAgendamentos } from "@/hooks/useAgendamento"
import { opcoesDeCidadesProximas, opcoesDeConvenio, opcoesDeHorariosDeManha, opcoesDeHorariosDeTarde } from "@/lib/opcoesDeDados"
import CalendarioAgenda from "@/components/agenda/CalendarioAgenda"
import { useDialog } from "@/context/DialogContext";
import { HiMiniMagnifyingGlassCircle } from "react-icons/hi2";
import { MdCalendarMonth, MdDriveFileRenameOutline, MdFilterAlt } from "react-icons/md";
import { AiOutlineSelect } from "react-icons/ai";
import InputSelect from "@/components/assets/inputs/InputSelect";
import InputTexto from "@/components/assets/inputs/InputTexto";
import Image from "next/image";

type Registro = Record<string, any>

type GrupoLocal = {
    local: Registro
    agendamentos: Registro[]
}

type AtendimentoDoPrestador = {
    horario: string
    agendamento: Registro
}

type GrupoPrestador = {
    id: string
    nome: string
    especialidade: string
    atendimentos: AtendimentoDoPrestador[]
}

type GrupoHorario = {
    horario: string
    prestadores: GrupoPrestador[]
}



function getDataAtual() {
    const hoje = new Date()

    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, "0")
    const dia = String(hoje.getDate()).padStart(2, "0")

    return `${ano}-${mes}-${dia}`
}

function normalizarData(valor: unknown): string | null {
    if (!valor) {
        return null
    }

    const data = new Date(String(valor))

    if (Number.isNaN(data.getTime())) {
        return null
    }

    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const dia = String(data.getDate()).padStart(2, "0")

    return `${ano}-${mes}-${dia}`
}

function formatarDataCompleta(data: string) {
    const dataFormatada = new Date(`${data}T12:00:00`)

    return dataFormatada.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

function obterNomeLocal(local: Registro) {
    return String(local?.nome ?? "Local não informado").trim()
}

function obterCidadeLocal(local: Registro) {
    const cidade = local?.cidade ?? ""
    const uf = local?.uf ?? ""

    return [cidade, uf].filter(Boolean).join(" - ")
}

function obterEnderecoLocal(local: Registro) {
    const primeiraLinha = [
        local?.rua,
        local?.numero && `nº ${local.numero}`,
        local?.bairro,
    ]
        .filter(Boolean)
        .join(", ")

    const complemento = local?.complemento
        ? ` — ${local.complemento}`
        : ""

    return `${primeiraLinha}${complemento}`
}

function obterNomePaciente(agendamento: Registro) {
    const paciente =
        agendamento?.paciente ??
        agendamento?.patient ??
        {}

    return (
        paciente?.nome ??
        paciente?.name ??
        agendamento?.nomePaciente ??
        agendamento?.pacienteNome ??
        "Paciente não informado"
    )
}

function obterIdPaciente(agendamento: Registro) {
    const paciente =
        agendamento?.paciente ??
        agendamento?.patient ??
        {}

    return String(
        agendamento?.pacienteId ??
        paciente?.id ??
        obterNomePaciente(agendamento)
    )
}

function obterPrestador(agendamento: Registro) {
    return (
        agendamento?.prestador ??
        agendamento?.profissional ??
        agendamento?.prestadorDeServico ??
        {}
    )
}

function obterNomePrestador(agendamento: Registro) {
    const prestador = obterPrestador(agendamento)

    return (
        prestador?.nome ??
        prestador?.name ??
        agendamento?.nomePrestador ??
        agendamento?.prestadorNome ??
        "Prestador não informado"
    )
}

function obterTexto(
    valor: unknown,
    fallback = "Não informado"
): string {
    if (valor === null || valor === undefined) {
        return fallback
    }

    if (
        typeof valor === "string" ||
        typeof valor === "number"
    ) {
        return String(valor)
    }

    if (typeof valor === "object") {
        const objeto = valor as Record<string, unknown>

        if (typeof objeto.nome === "string") {
            return objeto.nome
        }

        if (typeof objeto.label === "string") {
            return objeto.label
        }

        if (typeof objeto.descricao === "string") {
            return objeto.descricao
        }

        if (typeof objeto.tipo === "string") {
            return objeto.tipo
        }

        if (typeof objeto.codigo === "string") {
            return objeto.codigo
        }
    }

    return fallback
}


function obterIdPrestador(agendamento: Registro) {
    const prestador = obterPrestador(agendamento)

    return String(
        agendamento?.prestadorId ??
        prestador?.id ??
        obterNomePrestador(agendamento)
    )
}

function obterEspecialidadePrestador(
    agendamento: Registro
) {
    const prestador = obterPrestador(agendamento)

    return obterTexto(
        prestador?.especialidade ??
        prestador?.especialidadeNome ??
        agendamento?.especialidade ??
        agendamento?.especialidadeNome ??
        agendamento?.tipo,
        "Atendimento"
    )
}


function obterHorario(agendamento: Registro) {
    const horario =
        agendamento?.horario ??
        agendamento?.hora ??
        agendamento?.horaInicio ??
        agendamento?.horarioInicio

    if (horario) {
        return String(horario).slice(0, 5)
    }

    const dataHora =
        agendamento?.dataHora ??
        agendamento?.dataDoAgendamento

    if (dataHora) {
        const data = new Date(String(dataHora))

        if (!Number.isNaN(data.getTime())) {
            return data.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            })
        }
    }

    return "Horário não informado"
}

function obterStatusPaciente(agendamento: Registro) {
    return (
        agendamento?.statusPaciente ??
        agendamento?.status ??
        "AGENDADO"
    )
}

function contarPacientesUnicos(agendamentos: Registro[]) {
    return new Set(
        agendamentos.map((agendamento) =>
            obterIdPaciente(agendamento)
        )
    ).size
}

function agruparPorPrestador(
    agendamentos: Registro[]
): GrupoPrestador[] {
    const prestadores = new Map<string, GrupoPrestador>()

    for (const agendamento of agendamentos) {
        const prestadorId = obterIdPrestador(agendamento)

        if (!prestadores.has(prestadorId)) {
            prestadores.set(prestadorId, {
                id: prestadorId,
                nome: obterNomePrestador(agendamento),
                especialidade: obterEspecialidadePrestador(agendamento),
                atendimentos: [],
            })
        }

        prestadores.get(prestadorId)!.atendimentos.push({
            horario: obterHorario(agendamento),
            agendamento,
        })
    }

    return Array.from(prestadores.values())
        .map((prestador) => ({
            ...prestador,
            atendimentos: prestador.atendimentos.sort(
                (a, b) =>
                    a.horario.localeCompare(b.horario)
            ),
        }))
        .sort((a, b) =>
            a.nome.localeCompare(b.nome)
        )
}


export default function Page() {
    const { agendamentos, buscarAgendamentos } = useAgendamentos()
    const { abrirDialog } = useDialog()

    const [visibleDialogListaDePacientesDeDeterminadoDia, setVisibleDialogListaDePacientesDeDeterminadoDia] = useState(false);
    const [visible, setVisible] = useState(false)
    const [dataSelecionada, setDataSelecionada] = useState(getDataAtual())
    const [agendaSelecionada, setAgendaSelecionada] =
        useState<GrupoLocal | null>(null)

    const [prestadoresExpandidos, setPrestadoresExpandidos] =
        useState<string[]>([])

    const todosAgendamentos = useMemo(
        () => (agendamentos as Registro[]) ?? [],
        [agendamentos]
    )

    const agendamentosAgendados = useMemo(
        () =>
            todosAgendamentos.filter(
                (agendamento) =>
                    agendamento?.status === "AGENDADO" &&
                    agendamento?.agendado === true
            ),
        [todosAgendamentos]
    )

    const agendamentosPorLocal = useMemo<GrupoLocal[]>(() => {
        const mapa = new Map<number | string, GrupoLocal>()

        for (const agendamento of agendamentosAgendados) {
            const local = agendamento?.localDeAtendimento

            if (!local) {
                continue
            }

            const localId = local?.id ?? obterNomeLocal(local)

            if (!mapa.has(localId)) {
                mapa.set(localId, {
                    local,
                    agendamentos: [],
                })
            }

            mapa.get(localId)!.agendamentos.push(agendamento)
        }

        return Array.from(mapa.values())
    }, [agendamentosAgendados])

    const cancelarViagem = async (agendamento: Registro) => {
        if (!agendamento?.id) {
            return
        }

        try {
            const resposta = await fetch(
                `/api/agendamento/${agendamento.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        agendado: false
                    })
                }
            )

            const resultado = await resposta.json()

            if (!resposta.ok) {
                alert(
                    resultado.erro ||
                    "Não foi possível cancelar a viagem."
                )

                return
            }
            await buscarAgendamentos()
        } catch (erro) {
            console.error(
                "Erro ao cancelar viagem:",
                erro
            )

            alert(
                "Erro ao conectar com o servidor."
            )
        }
    }

    function confirmarCancelamento(agendamento: Registro) {
        abrirDialog({
            title: "Cancelar viagem",
            message: `Deseja realmente cancelar a viagem do paciente ${obterNomePaciente(agendamento)}?`,
            confirmText: "Sim, cancelar",
            cancelText: "Não",
            onConfirm: async () => {
                await cancelarViagem(agendamento)
            }
        })
    }

    const agendamentosDoDia = useMemo(() => {
        if (!agendaSelecionada) {
            return []
        }

        return agendaSelecionada.agendamentos.filter(
            (agendamento) =>
                normalizarData(
                    agendamento?.dataDoAgendamento ??
                    agendamento?.data ??
                    agendamento?.dataAgendamento
                ) === dataSelecionada
        )
    }, [agendaSelecionada, dataSelecionada])

    const gruposPorPrestador = useMemo(
        () =>
            agruparPorPrestador(
                agendamentosDoDia
            ),
        [agendamentosDoDia]
    )


    const datasComAgendamento = useMemo(() => {
        if (!agendaSelecionada) {
            return []
        }

        return Array.from(
            new Set(
                agendaSelecionada.agendamentos
                    .map((agendamento) =>
                        normalizarData(
                            agendamento?.dataDoAgendamento ??
                            agendamento?.data ??
                            agendamento?.dataAgendamento
                        )
                    )
                    .filter(Boolean) as string[]
            )
        )
    }, [agendaSelecionada])

    const totalPacientesDoDia = useMemo(
        () => contarPacientesUnicos(agendamentosDoDia),
        [agendamentosDoDia]
    )

    const totalPrestadoresDoDia = useMemo(
        () => {
            const prestadores = new Set(
                agendamentosDoDia.map(obterIdPrestador)
            )

            return prestadores.size
        },
        [agendamentosDoDia]
    )

    function abrirAgenda(agenda: GrupoLocal) {
        const primeiraDataComAgendamento =
            datasComAgendamento.length > 0
                ? datasComAgendamento[0]
                : getDataAtual()

        setAgendaSelecionada(agenda)
        setDataSelecionada(primeiraDataComAgendamento)
        setPrestadoresExpandidos([])
        setVisible(true)
    }

    function fecharAgenda() {
        setVisible(false)
        setPrestadoresExpandidos([])
    }

    function alternarPrestador(prestadorId: string) {
        setPrestadoresExpandidos((estadoAtual) =>
            estadoAtual.includes(prestadorId)
                ? estadoAtual.filter((id) => id !== prestadorId)
                : [...estadoAtual, prestadorId]
        )
    }

    function renderizarStatus(status: string) {
        const statusNormalizado = status.toUpperCase()

        if (statusNormalizado === "AGENDADO") {
            return "Confirmado"
        }

        if (statusNormalizado === "CONFIRMADO") {
            return "Confirmado"
        }

        if (statusNormalizado === "CANCELADO") {
            return "Cancelado"
        }

        if (statusNormalizado === "ATENDIDO") {
            return "Atendido"
        }

        return status
    }

    function obterTexto(
        valor: unknown,
        fallback = "Não informado"
    ): string {
        if (valor === null || valor === undefined) {
            return fallback
        }

        if (
            typeof valor === "string" ||
            typeof valor === "number"
        ) {
            return String(valor)
        }

        if (typeof valor === "object") {
            const objeto = valor as Record<string, unknown>

            if (typeof objeto.nome === "string") {
                return objeto.nome
            }

            if (typeof objeto.label === "string") {
                return objeto.label
            }

            if (typeof objeto.descricao === "string") {
                return objeto.descricao
            }

            if (typeof objeto.tipo === "string") {
                return objeto.tipo
            }

            if (typeof objeto.codigo === "string") {
                return objeto.codigo
            }
        }

        return fallback
    }

    const [filtroListaDePacientesDeDeterminadoDia, setFiltroListaDePacientesDeDeterminadoDia] = useState('')
    const [listaPacientesDoDia, setListaPacientesDoDia] = useState<Registro[]>([])
    const [listaGerada, setListaGerada] = useState(false)

    function gerarListaPacientes() {
        if (!filtroListaDePacientesDeDeterminadoDia) {
            alert("Selecione uma data.")
            return
        }

        const pacientes = todosAgendamentos.filter((agendamento) => {
            const dataAgendamento = normalizarData(
                agendamento?.dataDoAgendamento
            )

            const rede = agendamento?.localDeAtendimento?.rede

            return (
                dataAgendamento === filtroListaDePacientesDeDeterminadoDia &&
                agendamento?.status === "AGENDADO" &&
                agendamento?.agendado === true &&
                rede === "REDE_REFERENCIADA"
            )
        })

        setListaPacientesDoDia(pacientes)
        setListaGerada(true)
    }

    const [filtroRede, setFiltroRede] = useState('')
    const [filtroCidade, setFiltroCidade] = useState('')
    const [filtroNomePrestador, setFiltroNomePrestador] = useState('')
    const opcoesFiltroRede = opcoesDeConvenio

    const [dataHoraAtual, setDataHoraAtual] = useState(new Date())

    useEffect(() => {
        const intervalo = setInterval(() => {
            setDataHoraAtual(new Date())
        }, 1000)

        return () => clearInterval(intervalo)
    }, [])

    return (
        <>
            <div className="flex h-full flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-3xl font-bold text-verde-escuro">
                        <FaListCheck />
                        <h2>
                            Painel de Agenda dos Prestadores
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg border shadow-[0px_0px_2px_1px_var(--verde-escuro)] flex items-center gap-2 p-2 ml-auto">
                            <MdCalendarMonth className="text-3xl text-verde-escuro" />
                            <div className="flex flex-col text-black max-w-[200px]">
                                <span className="text-xs font-semibold text-verde-escuro">
                                    {dataHoraAtual.toLocaleDateString("pt-BR")}
                                </span>

                                <span className="text-xs">
                                    {dataHoraAtual.toLocaleTimeString("pt-BR")}
                                </span>
                            </div>
                        </div>
                        <div className="relative w-40 h-15">
                            <Image alt="logo sistema" src={'/logo/sistema-de-saude-verde.png'} fill className="object-contain" />
                        </div>
                    </div>
                </div>

                <div className="border border-verde rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center font-bold text-2xl text-verde gap-2">
                        <HiMiniMagnifyingGlassCircle className="text-3xl" />
                        <p>
                            Filtro de busca
                        </p>
                    </div>
                    <div className="grid grid-cols-[160px_160px_200px_1fr_140px] gap-4 2xl:grid-cols-[160px_160px_260px_1fr_140px]">
                        <div className="col-span-2">
                            <InputTexto icone={<MdDriveFileRenameOutline />} id="filtroNomePrestador" label="Nome do Prestador" nome="filtroNomePrestador" placeholder="Prestador bem Legal" setValor={setFiltroNomePrestador} valor={filtroNomePrestador} />
                        </div>
                        <InputSelect
                            icone={<AiOutlineSelect />}
                            id="filtroRede"
                            label="Rede"
                            nome="filtroRede"
                            setValor={setFiltroRede}
                            valor={filtroRede}
                            opcoes={opcoesFiltroRede}
                        />
                        <InputSelect
                            icone={<AiOutlineSelect />}
                            id="filtroCidade"
                            label="Cidade"
                            nome="filtroCidade"
                            setValor={setFiltroCidade}
                            valor={filtroCidade}
                            opcoes={opcoesDeCidadesProximas}
                        />
                        <button
                            type="button"
                            // onClick={handleBuscar}
                            className="font-bold bg-verde text-white h-fit mt-auto py-2 px-5 rounded-lg hover:bg-verde-escuro transition-all flex items-center justify-center gap-2"
                        >
                            <MdFilterAlt />
                            <p>Filtrar</p>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-2xl font-bold text-verde-escuro">
                            <FaUsers />
                            <h2 className="whitespace-nowrap">
                                Locais de Atendimento
                            </h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-lg border border-verde px-4 py-2 font-bold"
                            >
                                <div className="h-4 w-4 rounded-full bg-verde" />
                                <p className="text-sm whitespace-nowrap">
                                    Rede Municipal
                                </p>
                            </button>

                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-lg border border-blue-500 px-4 py-2 font-bold"
                            >
                                <div className="h-4 w-4 rounded-full bg-blue-500" />
                                <p className="text-sm whitespace-nowrap">
                                    Rede Referenciada
                                </p>
                            </button>

                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-lg border border-orange-500 px-4 py-2 font-bold"
                                onClick={() => setVisibleDialogListaDePacientesDeDeterminadoDia(true)}
                            >
                                <div className="h-4 w-4 rounded-full bg-orange-500" />
                                <p className="text-sm whitespace-nowrap">
                                    Gere a Lista de Pacientes
                                </p>
                            </button>
                        </div>
                    </div>

                    <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2 3xl:grid-cols-3">
                        {agendamentosPorLocal.map((agenda) => {
                            const local = agenda.local
                            const totalPacientes =
                                contarPacientesUnicos(
                                    agenda.agendamentos
                                )

                            const redeMunicipal =
                                local?.rede === "REDE_MUNICIPAL"

                            const datas = agenda.agendamentos
                                .map((agendamento) =>
                                    normalizarData(
                                        agendamento?.dataDoAgendamento ??
                                        agendamento?.data ??
                                        agendamento?.dataAgendamento
                                    )
                                )
                                .filter(Boolean)
                                .sort() as string[]

                            const primeiraData = datas[0]

                            return (
                                <li
                                    key={String(
                                        local?.id ??
                                        obterNomeLocal(local)
                                    )}
                                    className="flex flex-col gap-3 rounded-xl border border-verde bg-white p-4 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-verde">
                                            <FaRegBuilding />
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <h3 className="truncate text-lg font-bold text-verde-escuro">
                                                {obterNomeLocal(local)}
                                            </h3>

                                            <p className="capitalize">
                                                {obterTexto(
                                                    local?.tipo.replaceAll('_', ' ').toLowerCase(),
                                                    "Local de atendimento"
                                                )}
                                            </p>
                                        </div>

                                        <div
                                            className={[
                                                "flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-semibold text-white",
                                                redeMunicipal
                                                    ? "bg-verde"
                                                    : "bg-blue-500",
                                            ].join(" ")}
                                        >
                                            <FaRegBuilding />

                                            <span>
                                                {redeMunicipal
                                                    ? "Rede Municipal"
                                                    : "Rede Referenciada"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <HiOutlineLocationMarker className="text-lg text-verde" />

                                            <span>
                                                {obterCidadeLocal(local)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <IoMapSharp className="text-lg text-verde" />

                                            <span>
                                                {obterEnderecoLocal(local)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 rounded-lg bg-green-50 p-3  mt-auto">
                                        <div className="flex flex-col gap-1 text-sm">
                                            <div className="flex items-center gap-2">
                                                <FaRegCalendarAlt className="text-verde" />

                                                <span>
                                                    Próximo atendimento:{" "}
                                                    {primeiraData
                                                        ? formatarDataCompleta(
                                                            primeiraData
                                                        )
                                                        : "Não informado"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FaRegClock className="text-verde" />

                                                <span>
                                                    {totalPacientes} pacientes únicos
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="flex items-center gap-2 rounded-lg border border-verde px-4 py-2 font-semibold text-verde transition hover:bg-verde hover:text-white"
                                            onClick={() => abrirAgenda(agenda)}
                                        >
                                            <IoCalendarOutline />

                                            <span>
                                                Ver agenda
                                            </span>
                                        </button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>

            <Dialog
                visible={visible}
                onHide={fecharAgenda}
                style={{ width: "min(1150px, 92vw)" }}
                modal
                dismissableMask
                header={
                    <div className="flex min-w-0 flex-col">
                        <h2 className="text-xl font-bold text-verde-escuro">
                            Agenda do local
                        </h2>

                        {agendaSelecionada && (
                            <>
                                <p className="text-sm font-semibold text-gray-700">
                                    {obterNomeLocal(
                                        agendaSelecionada.local
                                    )}{" "}
                                    •{" "}
                                    {obterCidadeLocal(
                                        agendaSelecionada.local
                                    )}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {obterEnderecoLocal(
                                        agendaSelecionada.local
                                    )}
                                </p>
                            </>
                        )}
                    </div>
                }
                contentClassName="p-0"
            >
                {agendaSelecionada && (
                    <div className="flex max-h-[70vh] min-h-[560px] gap-5 overflow-hidden p-5">
                        <aside className="w-[360px] shrink-0 overflow-y-auto border-r border-gray-200 pr-5">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="font-bold text-verde-escuro">
                                    Selecionar data
                                </h3>

                                <span className="text-xs text-gray-500">
                                    {datasComAgendamento.length} dias
                                </span>
                            </div>

                            <CalendarioAgenda
                                dataSelecionada={dataSelecionada}
                                onChange={setDataSelecionada}
                                datasComAgendamento={
                                    datasComAgendamento
                                }
                            />

                            <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <HiOutlineLocationMarker className="text-xl text-verde" />

                                    <div className="min-w-0">
                                        <p className="truncate font-bold text-verde-escuro">
                                            {obterNomeLocal(
                                                agendaSelecionada.local
                                            )}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            {obterCidadeLocal(
                                                agendaSelecionada.local
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xs leading-5 text-gray-600">
                                    {obterEnderecoLocal(
                                        agendaSelecionada.local
                                    )}
                                </p>

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <div className="rounded-lg bg-white p-2">
                                        <p className="text-xs text-gray-500">
                                            Pacientes
                                        </p>

                                        <p className="font-bold text-verde-escuro">
                                            {totalPacientesDoDia}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-white p-2">
                                        <p className="text-xs text-gray-500">
                                            Prestadores
                                        </p>

                                        <p className="font-bold text-verde-escuro">
                                            {totalPrestadoresDoDia}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <section className="min-w-0 flex-1 overflow-y-auto pr-1">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Atendimentos do dia
                                    </p>

                                    <h3 className="text-xl font-bold text-verde-escuro">
                                        {formatarDataCompleta(
                                            dataSelecionada
                                        )}
                                    </h3>
                                </div>

                                <div
                                    className={[
                                        "rounded-lg px-3 py-2 text-sm font-semibold",
                                        agendaSelecionada.local?.rede ===
                                            "REDE_MUNICIPAL"
                                            ? "bg-green-100 text-verde-escuro"
                                            : "bg-blue-100 text-blue-700",
                                    ].join(" ")}
                                >
                                    {agendaSelecionada.local?.rede ===
                                        "REDE_MUNICIPAL"
                                        ? "Rede Municipal"
                                        : "Rede Referenciada"}
                                </div>
                            </div>

                            {gruposPorPrestador.length === 0 ? (
                                <div className="flex min-h-[200px] h-[87%] items-center justify-center rounded-xl border border-dashed border-gray-300 text-center">
                                    <div>
                                        <FaRegCalendarAlt className="mx-auto mb-3 text-3xl text-gray-400" />

                                        <p className="font-semibold text-gray-600">
                                            Nenhum atendimento encontrado
                                        </p>

                                        <p className="mt-1 text-sm text-gray-400">
                                            Selecione outro dia no calendário.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {gruposPorPrestador.map((prestador) => {
                                        const chave = prestador.id
                                        const expandido =
                                            prestadoresExpandidos.includes(chave)

                                        const pacientesUnicos = new Set(
                                            prestador.atendimentos.map(
                                                ({ agendamento }) =>
                                                    obterIdPaciente(agendamento)
                                            )
                                        ).size

                                        return (
                                            <article
                                                key={prestador.id}
                                                className={[
                                                    "overflow-hidden rounded-xl border bg-white",
                                                    expandido
                                                        ? "border-verde"
                                                        : "border-gray-200",
                                                ].join(" ")}
                                            >
                                                <button
                                                    type="button"
                                                    className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-green-50"
                                                    onClick={() =>
                                                        alternarPrestador(chave)
                                                    }
                                                >
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl text-verde">
                                                        <FaUser />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-bold text-gray-800">
                                                            {prestador.nome}
                                                        </p>

                                                        <p className="text-sm text-gray-500">
                                                            {prestador.especialidade}
                                                        </p>

                                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-verde-escuro">
                                                            <span>
                                                                {prestador.atendimentos.length}{" "}
                                                                {prestador.atendimentos.length === 1
                                                                    ? "atendimento"
                                                                    : "atendimentos"}
                                                            </span>

                                                            <span>
                                                                {pacientesUnicos}{" "}
                                                                {pacientesUnicos === 1
                                                                    ? "paciente"
                                                                    : "pacientes"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-verde text-verde">
                                                        {expandido ? (
                                                            <FaChevronUp />
                                                        ) : (
                                                            <FaChevronDown />
                                                        )}
                                                    </span>
                                                </button>

                                                {expandido && (
                                                    <div className="border-t border-green-100 bg-green-50/60 p-4">
                                                        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-verde-escuro">
                                                            <FaRegClock />

                                                            <span>
                                                                Atendimentos cadastrados
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col gap-2">
                                                            {prestador.atendimentos.map(
                                                                ({ horario, agendamento }) => (
                                                                    <div
                                                                        key={agendamento.id}
                                                                        className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-3"
                                                                    >
                                                                        <div className="flex min-w-0 items-center gap-3">
                                                                            <span className="rounded-md bg-green-100 px-2 py-1 text-sm font-bold text-verde-escuro">
                                                                                {horario}
                                                                            </span>

                                                                            <div className="min-w-0">
                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="truncate text-sm font-semibold text-gray-700">
                                                                                        {obterNomePaciente(agendamento)}
                                                                                    </p>
                                                                                    <a href={`https://wa.me/55${agendamento.paciente.telefone1.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline cursor-pointer text-sm" >
                                                                                        {agendamento.paciente.telefone1}
                                                                                    </a>
                                                                                </div>

                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {agendamento.procedimento?.nome ??
                                                                                            agendamento.tipo ??
                                                                                            "Atendimento"}
                                                                                    </p>

                                                                                    <p className="truncate text-xs text-gray-500">
                                                                                        Prestador: {agendamento.prestador?.nome ??
                                                                                            "Prestador não informado"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-2">
                                                                            <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-[11px] font-semibold text-green-700">
                                                                                {renderizarStatus(
                                                                                    obterStatusPaciente(
                                                                                        agendamento
                                                                                    )
                                                                                )}
                                                                            </span>
                                                                            {/* Cancelar viagem */}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    confirmarCancelamento(agendamento)
                                                                                }
                                                                                className="text-red-500 border border-red-500 px-2 py-1 rounded-lg hover:bg-red-500 hover:text-white transition"
                                                                            >
                                                                                <GiCancel />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </article>
                                        )
                                    })}

                                </div>
                            )}
                        </section>
                    </div>
                )}
            </Dialog>


            <Dialog header="Gerar lista de pacientes de determinado dia" visible={visibleDialogListaDePacientesDeDeterminadoDia} style={{ width: '50vw' }} onHide={() => { if (!visibleDialogListaDePacientesDeDeterminadoDia) return; setVisibleDialogListaDePacientesDeDeterminadoDia(false); }}>
                <div className="flex justify-between">
                    <input
                        type="date"
                        name="filtroListaDePacientesDeDeterminadoDia"
                        id="filtroListaDePacientesDeDeterminadoDia"
                        value={filtroListaDePacientesDeDeterminadoDia}
                        onChange={(e) =>
                            setFiltroListaDePacientesDeDeterminadoDia(e.target.value)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                    <button
                        type="button"
                        onClick={gerarListaPacientes}
                        className="flex items-center gap-2 text-xl font-bold text-verde rounded-xl border border-verde-escuro px-4 py-1"
                    >
                        <div>
                            <FaListCheck />
                        </div>
                        <p>Gerar Lista</p>
                    </button>
                </div>
                <div>
                    {listaGerada && (
                        <div className="mt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-verde-escuro">
                                        Pacientes para atendimento fora da cidade
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Data:{" "}
                                        {formatarDataCompleta(
                                            filtroListaDePacientesDeDeterminadoDia
                                        )}
                                    </p>
                                </div>

                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                                    {contarPacientesUnicos(listaPacientesDoDia)} pacientes
                                </span>
                            </div>

                            {listaPacientesDoDia.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                                    <FaUsers className="mx-auto mb-3 text-3xl text-gray-400" />

                                    <p className="font-semibold text-gray-600">
                                        Nenhum paciente encontrado
                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">
                                        Não existem pacientes agendados para fora da cidade
                                        nesta data.
                                    </p>
                                </div>
                            ) : (
                                <div className="max-h-[450px] overflow-y-auto rounded-xl border border-gray-200">
                                    <div className="flex flex-col">
                                        {listaPacientesDoDia.map((agendamento, index) => (
                                            <div
                                                key={agendamento.id}
                                                className="flex items-center justify-between gap-4 border-b border-gray-100 p-4 last:border-b-0"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                                        {index + 1}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate font-bold text-gray-800">
                                                            {obterNomePaciente(agendamento)}
                                                        </p>

                                                        <p className="text-sm text-gray-500">
                                                            {obterHorario(agendamento)}
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            {agendamento.procedimento?.nome ??
                                                                agendamento.especialidade?.nome ??
                                                                agendamento.tipo ??
                                                                "Atendimento"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        {obterNomeLocal(
                                                            agendamento.localDeAtendimento
                                                        )}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {obterCidadeLocal(
                                                            agendamento.localDeAtendimento
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Dialog>
        </>
    )
}