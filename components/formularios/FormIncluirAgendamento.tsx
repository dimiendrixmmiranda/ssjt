import { useEffect, useState } from "react"

import { FaSourcetree } from "react-icons/fa6"
import {
    AiOutlineCalendar,
    AiOutlineClockCircle,
    AiOutlineSelect
} from "react-icons/ai"
import { RiSave2Line } from "react-icons/ri"
import { MdCancel } from "react-icons/md"

import InputSelect from "../assets/inputs/InputSelect"
import CalendarioAgenda from "../agenda/CalendarioAgenda"

import { useLocaisDeAtendimento } from "@/hooks/useLocaisDeAtendimento"
import { usePrestadores } from "@/hooks/usePrestadores"

import {
    opcoesDeHorariosDeManha,
    opcoesDeHorariosDeTarde
} from "@/lib/opcoesDeDados"


interface FormIncluirAgendamentoProps {
    agendamento: any
    onClose: () => void
    onAgendamentoSalvo?: () => void
}


export default function FormIncluirAgendamento({
    agendamento,
    onClose,
    onAgendamentoSalvo
}: FormIncluirAgendamentoProps) {

    console.log(agendamento)

    const { locais } = useLocaisDeAtendimento()
    const { prestadores } = usePrestadores()


    // =========================================================
    // FUNÇÕES AUXILIARES
    // =========================================================

    const getDataAtual = () => {
        const hoje = new Date()

        const ano = hoje.getFullYear()
        const mes = String(hoje.getMonth() + 1).padStart(2, "0")
        const dia = String(hoje.getDate()).padStart(2, "0")

        return `${ano}-${mes}-${dia}`
    }


    const formatarData = (valor: string | Date) => {
        const data = new Date(valor)

        const ano = data.getFullYear()
        const mes = String(data.getMonth() + 1).padStart(2, "0")
        const dia = String(data.getDate()).padStart(2, "0")

        return `${ano}-${mes}-${dia}`
    }


    const formatarHorario = (valor: string | Date) => {
        const data = new Date(valor)

        const horas = String(data.getHours()).padStart(2, "0")
        const minutos = String(data.getMinutes()).padStart(2, "0")

        return `${horas}:${minutos}`
    }


    // =========================================================
    // ESTADOS
    // =========================================================

    const [unidadeDeOrigem, setUnidadeDeOrigem] = useState(
        agendamento?.unidadeDeOrigem ?? null
    )

    const [convenio, setConvenio] = useState("")

    const [localDeAtendimento, setLocalDeAtendimento] = useState(
        agendamento?.localDeAtendimentoId
            ? String(agendamento.localDeAtendimentoId)
            : ""
    )

    const [prestador, setPrestador] = useState(
        agendamento?.prestadorId
            ? String(agendamento.prestadorId)
            : ""
    )

    const [dataSelecionada, setDataSelecionada] = useState(
        agendamento?.dataDoAgendamento
            ? formatarData(agendamento.dataDoAgendamento)
            : getDataAtual()
    )

    const [horarioSelecionado, setHorarioSelecionado] = useState(
        agendamento?.dataDoAgendamento
            ? formatarHorario(agendamento.dataDoAgendamento)
            : ""
    )

    const [periodo, setPeriodo] = useState<"MANHA" | "TARDE">(
        agendamento?.dataDoAgendamento &&
        Number(formatarHorario(agendamento.dataDoAgendamento).split(":")[0]) >= 12
            ? "TARDE"
            : "MANHA"
    )

    const [agendamentosDoDia, setAgendamentosDoDia] = useState<any[]>([])


    // =========================================================
    // LOCAIS
    // =========================================================

    const locaisJoaquimTavora = locais.filter(
        local => local.cep === "86455-000"
    )


    const opcoesUnidadesDeOrigem = [
        {
            label: "Selecione",
            valor: ""
        },
        ...locaisJoaquimTavora.map(local => ({
            label: local.nome,
            valor: String(local.id)
        }))
    ]


    const opcoesRedeMunicipal = [
        {
            label: "Selecione",
            valor: ""
        },
        ...locais
            .filter(local => local.cep === "86455-000")
            .map(local => ({
                label: local.nome,
                valor: String(local.id)
            }))
    ]


    const opcoesRedeReferenciada = [
        {
            label: "Selecione",
            valor: ""
        },
        ...locais
            .filter(local => local.cep !== "86455-000")
            .map(local => ({
                label: local.nome,
                valor: String(local.id)
            }))
    ]


    // =========================================================
    // CONVÊNIO
    // =========================================================

    const opcoesDeConvenio = [
        {
            label: "Selecione",
            valor: ""
        },
        {
            label: "Rede Municipal",
            valor: "REDE_MUNICIPAL"
        },
        {
            label: "Rede Referenciada",
            valor: "REDE_REFERENCIADA"
        }
    ]


    // =========================================================
    // PRESTADORES
    // =========================================================

    const opcoesDePrestadores = [
        {
            label: "Selecione",
            valor: ""
        },

        ...(convenio === "REDE_MUNICIPAL"
            ? prestadores
                .filter(
                    prestador =>
                        prestador.rede === "REDE_MUNICIPAL"
                )
                .map(prestador => ({
                    label: prestador.nome,
                    valor: String(prestador.id)
                }))

            : prestadores
                .filter(
                    prestador =>
                        prestador.rede === "REDE_REFERENCIADA"
                )
                .map(prestador => ({
                    label: prestador.nome,
                    valor: String(prestador.id)
                }))
        )
    ]


    // =========================================================
    // CARREGAR DADOS QUANDO TROCAR DE AGENDAMENTO
    // =========================================================

    useEffect(() => {

        if (!agendamento) {
            return
        }


        setUnidadeDeOrigem(
            agendamento.unidadeDeOrigem ?? null
        )


        setLocalDeAtendimento(
            agendamento.localDeAtendimentoId
                ? String(agendamento.localDeAtendimentoId)
                : ""
        )


        setPrestador(
            agendamento.prestadorId
                ? String(agendamento.prestadorId)
                : ""
        )


        if (agendamento.dataDoAgendamento) {

            const data = formatarData(
                agendamento.dataDoAgendamento
            )

            const horario = formatarHorario(
                agendamento.dataDoAgendamento
            )

            setDataSelecionada(data)
            setHorarioSelecionado(horario)


            const hora = Number(
                horario.split(":")[0]
            )

            setPeriodo(
                hora >= 12
                    ? "TARDE"
                    : "MANHA"
            )
        }

    }, [agendamento?.id])


    // =========================================================
    // BUSCAR AGENDAMENTOS DO DIA
    // =========================================================

    const buscarAgendamentosDoDia = async () => {

        if (
            !dataSelecionada ||
            !localDeAtendimento ||
            !prestador
        ) {
            setAgendamentosDoDia([])
            return
        }


        try {

            const params = new URLSearchParams({

                data: dataSelecionada,

                localDeAtendimentoId:
                    localDeAtendimento,

                prestadorId:
                    prestador,

                status: "AGENDADO",

                ativo: "true"
            })


            // Não considera o próprio agendamento
            // como horário ocupado
            if (agendamento?.id) {

                params.set(
                    "agendamentoId",
                    String(agendamento.id)
                )

            }


            const resposta = await fetch(
                `/api/agendamento?${params.toString()}`
            )


            if (!resposta.ok) {
                throw new Error(
                    "Erro ao buscar agendamentos"
                )
            }


            const dados = await resposta.json()

            setAgendamentosDoDia(dados)

        } catch (erro) {

            console.error(
                "Erro ao buscar horários ocupados:",
                erro
            )

            setAgendamentosDoDia([])

        }

    }


    useEffect(() => {

        buscarAgendamentosDoDia()

    }, [
        dataSelecionada,
        localDeAtendimento,
        prestador,
        agendamento?.id
    ])


    // =========================================================
    // SALVAR AGENDAMENTO
    // =========================================================

    const handleSalvarAgendamento = async () => {

        try {

            if (!agendamento?.id) {

                alert(
                    "Agendamento não encontrado."
                )

                return
            }


            if (!dataSelecionada) {

                alert(
                    "Selecione uma data."
                )

                return
            }


            if (!horarioSelecionado) {

                alert(
                    "Selecione um horário."
                )

                return
            }


            if (!localDeAtendimento) {

                alert(
                    "Selecione o local de atendimento."
                )

                return
            }


            if (!prestador) {

                alert(
                    "Selecione o prestador executante."
                )

                return
            }


            // =================================================
            // VERIFICAR SE O HORÁRIO FOI OCUPADO
            // =================================================

            const horarioOcupado =
                agendamentosDoDia.some(item => {

                    if (!item.dataDoAgendamento) {
                        return false
                    }


                    const data = new Date(
                        item.dataDoAgendamento
                    )


                    const hora =
                        data.toLocaleTimeString(
                            "pt-BR",
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false
                            }
                        )


                    return hora === horarioSelecionado

                })


            if (horarioOcupado) {

                alert(
                    "Este horário já está ocupado. Selecione outro horário."
                )

                await buscarAgendamentosDoDia()

                return
            }


            // =================================================
            // DADOS PARA O PATCH
            // =================================================

            const dados = {

                dataDoAgendamento:
                    `${dataSelecionada}T${horarioSelecionado}:00`,

                dataDeSaida:
                    new Date().toISOString(),

                localDeAtendimentoId:
                    Number(localDeAtendimento),

                prestadorId:
                    Number(prestador),

                status: "AGENDADO"
            }


            // =================================================
            // SALVAR
            // =================================================

            const resposta = await fetch(
                `/api/agendamento/${agendamento.id}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        dados
                    )
                }
            )


            const resultado =
                await resposta.json()


            if (!resposta.ok) {

                alert(
                    resultado.erro ||
                    "Não foi possível salvar o agendamento."
                )

                return
            }


            alert(
                "Agendamento realizado com sucesso!"
            )


            // Atualiza a tabela da página principal
            onAgendamentoSalvo?.()


            // Fecha o dialog
            onClose()


        } catch (erro) {

            console.error(
                "Erro ao salvar agendamento:",
                erro
            )

            alert(
                "Erro ao conectar com o servidor."
            )

        }

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div>

            <div className="grid grid-cols-2 gap-4">


                {/* =====================================================
                    INFORMAÇÕES DO AGENDAMENTO
                ====================================================== */}

                <div className="border border-zinc-200 flex flex-col gap-4 p-4 rounded-lg w-full">

                    <div className="flex items-center gap-2 mb-4">

                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">

                            <FaSourcetree className="text-green-700" />

                        </div>


                        <div>

                            <h2 className="font-semibold text-zinc-800">
                                Informações do Agendamento
                            </h2>

                            <p className="text-xs text-zinc-500">
                                Informações principais do agendamento
                            </p>

                        </div>

                    </div>


                    {/* Unidade de origem */}

                    <InputSelect
                        icone={<AiOutlineSelect />}
                        id="unidadeDeOrigem"
                        label="Unidade de Origem"
                        nome="unidadeDeOrigem"

                        setValor={(valor) => {

                            const local =
                                locais.find(
                                    local =>
                                        String(local.id) === valor
                                )

                            setUnidadeDeOrigem(
                                local ?? null
                            )

                        }}

                        valor={
                            unidadeDeOrigem
                                ? String(unidadeDeOrigem.id)
                                : ""
                        }

                        opcoes={
                            opcoesUnidadesDeOrigem
                        }
                    />


                    {/* Convênio */}

                    <InputSelect
                        icone={<AiOutlineSelect />}
                        id="convenio"
                        label="Convênio"
                        nome="convenio"

                        setValor={(valor) => {

                            setConvenio(valor)

                            // Limpa dependências
                            setLocalDeAtendimento("")
                            setPrestador("")

                        }}

                        valor={convenio}

                        opcoes={
                            opcoesDeConvenio
                        }
                    />


                    {/* Local de atendimento */}

                    <InputSelect
                        icone={<AiOutlineSelect />}
                        id="localDeAtendimento"
                        label="Selecione o Local de Atendimento"
                        nome="localDeAtendimento"

                        setValor={setLocalDeAtendimento}

                        valor={
                            localDeAtendimento
                        }

                        opcoes={
                            convenio === "REDE_MUNICIPAL"
                                ? opcoesRedeMunicipal
                                : opcoesRedeReferenciada
                        }
                    />


                    {/* Prestador */}

                    <InputSelect
                        icone={<AiOutlineSelect />}
                        id="prestador"
                        label="Selecione um prestador"
                        nome="prestador"

                        setValor={setPrestador}

                        valor={
                            prestador
                        }

                        opcoes={
                            opcoesDePrestadores
                        }
                    />

                </div>


                {/* =====================================================
                    CALENDÁRIO
                ====================================================== */}

                <div className="border border-gray-200 rounded-lg p-4">

                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                        Calendário
                    </h3>


                    <CalendarioAgenda
                        dataSelecionada={
                            dataSelecionada
                        }

                        onChange={
                            (data) => {

                                setDataSelecionada(
                                    data
                                )

                                setHorarioSelecionado(
                                    ""
                                )

                            }
                        }
                    />

                </div>


                {/* =====================================================
                    INFORMAÇÕES DA CONSULTA / PROCEDIMENTO
                ====================================================== */}

                <div className="border border-zinc-200 rounded-lg p-4">

                    <div className="flex items-center gap-2 mb-4">

                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">

                            <FaSourcetree className="text-green-700" />

                        </div>


                        <div>

                            <h2 className="font-semibold text-zinc-800">
                                Informações da Consulta/Procedimento
                            </h2>

                            <p className="text-xs text-zinc-500">
                                Dados vinculados ao agendamento selecionado
                            </p>

                        </div>

                    </div>


                    {/* Tipo */}

                    <div className="mb-4">

                        <span className="text-xs text-zinc-500">
                            Tipo de atendimento
                        </span>


                        <div className="mt-1">

                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">

                                {agendamento?.tipo}

                            </span>

                        </div>

                    </div>


                    <div className="grid grid-cols-2 gap-4">


                        {/* Procedimento */}

                        <div>

                            <span className="text-xs text-zinc-500">
                                Procedimento
                            </span>

                            <p className="text-sm font-medium text-zinc-800 mt-1">

                                {
                                    agendamento?.procedimento?.nome ||
                                    "Não informado"
                                }

                            </p>


                            {
                                agendamento?.procedimento?.codigo && (

                                    <p className="text-xs text-zinc-500">

                                        Código:{" "}

                                        {
                                            agendamento.procedimento.codigo
                                        }

                                    </p>

                                )
                            }

                        </div>


                        {/* Procedimento complementar */}

                        <div>

                            <span className="text-xs text-zinc-500">
                                Procedimento complementar
                            </span>

                            <p className="text-sm font-medium text-zinc-800 mt-1">

                                {
                                    agendamento?.procedimentoFilho?.nome ||
                                    "Não informado"
                                }

                            </p>

                        </div>


                        {/* Especialidade */}

                        <div>

                            <span className="text-xs text-zinc-500">
                                Especialidade
                            </span>

                            <p className="text-sm font-medium text-zinc-800 mt-1">

                                {
                                    agendamento?.especialidade?.nome ||
                                    "Não informado"
                                }

                            </p>

                        </div>


                        {/* Especialidade complementar */}

                        <div>

                            <span className="text-xs text-zinc-500">
                                Especialidade complementar
                            </span>

                            <p className="text-sm font-medium text-zinc-800 mt-1">

                                {
                                    agendamento?.especialidadeFilha?.nome ||
                                    "Não informado"
                                }

                            </p>

                        </div>


                        {/* Lado */}

                        <div>

                            <span className="text-xs text-zinc-500">
                                Lado
                            </span>

                            <p className="text-sm font-medium text-zinc-800 mt-1">

                                {
                                    agendamento?.lado ||
                                    "Não informado"
                                }

                            </p>

                        </div>


                        {/* Prioridade */}

                        <div>

                            <span className="text-xs text-zinc-500">
                                Prioridade
                            </span>


                            <div className="mt-1">

                                <span
                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                                    ${
                                        agendamento?.prioridade === "URGENTE"
                                            ? "bg-red-100 text-red-700"
                                            : agendamento?.prioridade === "PRIORIDADE"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-zinc-100 text-zinc-700"
                                    }`}
                                >

                                    {
                                        agendamento?.prioridade ||
                                        "NORMAL"
                                    }

                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="border-t border-zinc-200 my-4" />


                    <div className="grid grid-cols-2 gap-4">


                        {/* Tipo de consulta */}

                        <div>

                            <span className="text-xs text-zinc-500">
                                Tipo de consulta
                            </span>

                            <p className="text-sm font-medium text-zinc-800 mt-1">

                                {
                                    agendamento?.tipoDeConsulta ||
                                    "Não se aplica"
                                }

                            </p>

                        </div>


                        {/* Condição de retorno */}

                        <div>

                            <span className="text-xs text-zinc-500">
                                Condição de retorno
                            </span>

                            <p className="text-sm font-medium text-zinc-800 mt-1">

                                {
                                    agendamento?.condicaoDeRetorno ||
                                    "Não informado"
                                }

                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-2 gap-4 mt-4">


                        {/* Data de entrada */}

                        <div>

                            <span className="text-xs text-zinc-500">
                                Data de Entrada
                            </span>

                            <p className="text-sm font-medium text-zinc-800 mt-1">

                                {
                                    agendamento?.dataDeEntrada
                                        ? new Date(
                                            agendamento.dataDeEntrada
                                        ).toLocaleDateString(
                                            "pt-BR"
                                        )
                                        : "Não informado"
                                }

                            </p>

                        </div>


                        {/* Dias na fila */}

                        <div>

                            <span className="text-xs text-zinc-500">
                                Dias na fila
                            </span>

                            <p className="text-sm font-medium text-zinc-800 mt-1">

                                {
                                    agendamento?.dataDeEntrada
                                        ? Math.max(
                                            0,
                                            Math.floor(
                                                (
                                                    new Date().getTime() -
                                                    new Date(
                                                        agendamento.dataDeEntrada
                                                    ).getTime()
                                                ) /
                                                (1000 * 60 * 60 * 24)
                                            )
                                        )
                                        : 0
                                }

                            </p>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    AGENDA
                ====================================================== */}

                <div className="border border-zinc-200 rounded-lg p-4 flex flex-col">

                    <div className="flex items-center gap-2 mb-4">

                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">

                            <AiOutlineClockCircle className="text-green-700 text-lg" />

                        </div>


                        <div>

                            <h2 className="font-semibold text-zinc-800">
                                Agenda
                            </h2>

                            <p className="text-xs text-zinc-500">
                                Selecione um horário disponível
                            </p>

                        </div>

                    </div>


                    {/* Data */}

                    <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 mb-3">

                        <div>

                            <span className="text-xs text-zinc-500">
                                Data selecionada
                            </span>

                            <p className="text-sm font-semibold text-zinc-800">

                                {
                                    dataSelecionada
                                        ? new Date(
                                            `${dataSelecionada}T00:00:00`
                                        ).toLocaleDateString(
                                            "pt-BR"
                                        )
                                        : "Selecione uma data"
                                }

                            </p>

                        </div>


                        <AiOutlineCalendar className="text-zinc-500 text-lg" />

                    </div>


                    {/* Período */}

                    <div className="mb-3">

                        <span className="text-xs text-zinc-500 block mb-2">
                            Período
                        </span>


                        <div className="grid grid-cols-2 gap-2">


                            <button
                                type="button"

                                onClick={() => {

                                    setPeriodo(
                                        "MANHA"
                                    )

                                    setHorarioSelecionado(
                                        ""
                                    )

                                }}

                                className={`
                                    py-2
                                    rounded-lg
                                    border
                                    text-sm
                                    font-medium
                                    transition
                                    ${
                                        periodo === "MANHA"
                                            ? "bg-green-700 text-white border-green-700"
                                            : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                                    }
                                `}
                            >

                                ☀️ Manhã

                            </button>


                            <button
                                type="button"

                                onClick={() => {

                                    setPeriodo(
                                        "TARDE"
                                    )

                                    setHorarioSelecionado(
                                        ""
                                    )

                                }}

                                className={`
                                    py-2
                                    rounded-lg
                                    border
                                    text-sm
                                    font-medium
                                    transition
                                    ${
                                        periodo === "TARDE"
                                            ? "bg-green-700 text-white border-green-700"
                                            : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                                    }
                                `}
                            >

                                🌤️ Tarde

                            </button>

                        </div>

                    </div>


                    {/* Legenda */}

                    <div className="flex items-center gap-4 mb-2">

                        <div className="flex items-center gap-1.5">

                            <span className="w-2 h-2 rounded-full bg-green-500" />

                            <span className="text-xs text-zinc-500">
                                Disponível
                            </span>

                        </div>


                        <div className="flex items-center gap-1.5">

                            <span className="w-2 h-2 rounded-full bg-zinc-400" />

                            <span className="text-xs text-zinc-500">
                                Ocupado
                            </span>

                        </div>

                    </div>


                    {/* Horários */}

                    <div className="grid gap-2 overflow-y-auto max-h-[250px] pr-1">

                        {
                            (
                                periodo === "MANHA"
                                    ? opcoesDeHorariosDeManha
                                    : opcoesDeHorariosDeTarde
                            ).map(horario => {

                                const agendamentoDoHorario =
                                    agendamentosDoDia.find(
                                        item => {

                                            if (
                                                !item.dataDoAgendamento
                                            ) {
                                                return false
                                            }


                                            const data =
                                                new Date(
                                                    item.dataDoAgendamento
                                                )


                                            const hora =
                                                data.toLocaleTimeString(
                                                    "pt-BR",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: false
                                                    }
                                                )


                                            return (
                                                hora ===
                                                horario
                                            )

                                        }
                                    )


                                const ocupado =
                                    !!agendamentoDoHorario


                                const selecionado =
                                    horarioSelecionado ===
                                    horario


                                return (

                                    <button
                                        key={horario}
                                        type="button"
                                        disabled={ocupado}

                                        onClick={() =>
                                            setHorarioSelecionado(
                                                horario
                                            )
                                        }

                                        className={`
                                            relative
                                            flex
                                            flex-col
                                            items-start
                                            px-3
                                            py-2.5
                                            rounded-lg
                                            border
                                            text-sm
                                            transition

                                            ${
                                                ocupado
                                                    ? "bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed"
                                                    : selecionado
                                                        ? "bg-green-700 border-green-700 text-white shadow-sm"
                                                        : "bg-white border-zinc-200 text-zinc-700 hover:border-green-500 hover:bg-green-50"
                                            }
                                        `}
                                    >

                                        <span className="font-semibold">
                                            {horario}
                                        </span>


                                        {
                                            agendamentoDoHorario && (

                                                <span className="text-xs text-left mt-1 truncate w-full">

                                                    {
                                                        agendamentoDoHorario
                                                            .paciente
                                                            ?.nome
                                                    }

                                                </span>

                                            )
                                        }

                                    </button>

                                )

                            })
                        }

                    </div>

                </div>


                {/* =====================================================
                    BOTÕES
                ====================================================== */}

                <div className="flex items-center gap-4 ml-auto col-span-2">

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center border border-red-500 text-red-500 rounded-lg font-bold text-xl px-4 py-2 gap-2 duration-300 transition-all hover:bg-red-500 hover:text-white"
                    >

                        <MdCancel />

                        <p>
                            Cancelar
                        </p>

                    </button>


                    <button
                        type="button"
                        onClick={handleSalvarAgendamento}
                        className="flex items-center border border-verde-escuro text-verde-escuro rounded-lg font-bold text-xl px-4 py-2 gap-2 duration-300 transition-all hover:bg-verde-escuro hover:text-white"
                    >

                        <RiSave2Line />

                        <p>
                            Salvar
                        </p>

                    </button>

                </div>

            </div>

        </div>

    )
}