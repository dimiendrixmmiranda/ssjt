import { FaSourcetree } from "react-icons/fa6"
import InputSelect from "../assets/inputs/InputSelect"
import { useLocaisDeAtendimento } from "@/hooks/useLocaisDeAtendimento"
import { AiOutlineCalendar, AiOutlineClockCircle, AiOutlineSelect } from "react-icons/ai"
import { useState } from "react"
import { usePrestadores } from "@/hooks/usePrestadores"
import { opcoesDeHorariosDeManha, opcoesDeHorariosDeTarde } from "@/lib/opcoesDeDados"
import CalendarioAgenda from "../agenda/CalendarioAgenda"
import { RiSave2Line } from "react-icons/ri"
import { MdCancel } from "react-icons/md"
import { Local, Prestador } from "@/app/generated/prisma/client"
import { useDialog } from "@/context/DialogContext"

interface FormIncluirAgendamentoProps {
    agendamento: any
    onClose: () => void
}

export default function FormIncluirAgendamento({
    agendamento,
    onClose
}: FormIncluirAgendamentoProps) {
    const { locais } = useLocaisDeAtendimento()
    const { prestadores } = usePrestadores()
    const [unidadeDeOrigem, setUnidadeDeOrigem] = useState(agendamento.unidadeDeOrigem)
    const locaisJoaquimTavora = locais.filter(local => local.cep === '86455-000')
    const { } = useDialog()
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

    const opcoesDeConvenio = [
        {
            label: 'Selecione',
            valor: ''
        },
        {
            label: 'Rede Municipal',
            valor: 'REDE_MUNICIPAL'
        },
        {
            label: 'Rede Referenciada',
            valor: 'REDE_REFERENCIADA'
        }
    ]

    const [convenio, setConvenio] = useState('')

    const opcoesRedeMunicipal = [
        {
            label: "Selecione",
            valor: ''
        },
        ...locais
            .filter(local => local.cep === '86455-000')
            .map(local => ({
                label: local.nome,
                valor: String(local.id)
            }))
    ]

    const opcoesRedeReferenciada = [
        {
            label: "Selecione",
            valor: ''
        },
        ...locais
            .filter(local => local.cep !== '86455-000')
            .map(local => ({
                label: local.nome,
                valor: String(local.id)
            }))
    ]

    const [prestador, setPrestador] = useState('')

    const opcoesDePrestadores = [
        {
            label: "Selecione",
            valor: ''
        },
        ...convenio === 'REDE_MUNICIPAL' ? prestadores.filter(prestador => prestador.rede === 'REDE_MUNICIPAL')
            .map(prestador => ({
                label: prestador.nome,
                valor: String(prestador.id)
            })) :
            prestadores.filter(prestador => prestador.rede === 'REDE_REFERENCIADA').map(prestador => ({
                label: prestador.nome,
                valor: String(prestador.id)
            }))
    ]

    const [horarioSelecionado, setHorarioSelecionado] = useState('')
    const [periodo, setPeriodo] = useState<'MANHA' | 'TARDE'>('MANHA')

    const getDataAtual = () => {
        const hoje = new Date()

        const ano = hoje.getFullYear()
        const mes = String(hoje.getMonth() + 1).padStart(2, '0')
        const dia = String(hoje.getDate()).padStart(2, '0')

        return `${ano}-${mes}-${dia}`
    }

    const [dataSelecionada, setDataSelecionada] = useState(getDataAtual())


    const [dataDoAgendamento, setDataDoAgendamento] = useState(
        new Date().toISOString().split("T")[0]
    )

    const [localDeAtendimento, setLocalDeAtendimento] = useState('')

    const [prestadorExecutante, setPrestadorExecutante] =
        useState<Prestador | null>(null)

    const handleSalvarAgendamento = async () => {
        try {
            if (!agendamento?.id) {
                alert("Agendamento não encontrado.")
                return
            }

            if (!dataSelecionada) {
                alert("Selecione uma data.")
                return
            }

            if (!horarioSelecionado) {
                alert("Selecione um horário.")
                return
            }

            if (!localDeAtendimento) {
                alert("Selecione o local de atendimento.")
                return
            }

            if (!prestador) {
                alert("Selecione o prestador executante.")
                return
            }

            const dados = {
                dataDoAgendamento: `${dataSelecionada}T${horarioSelecionado}:00`,
                dataDeSaida: new Date().toISOString(),
                localDeAtendimentoId: Number(localDeAtendimento),
                prestadorId: Number(prestador),
                status: "AGENDADO",
            }

            const resposta = await fetch(
                `/api/agendamento/${agendamento.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dados),
                }
            )

            const resultado = await resposta.json()

            if (!resposta.ok) {
                alert(
                    resultado.erro ||
                    "Não foi possível salvar o agendamento."
                )
                return
            }

            alert("Agendamento realizado com sucesso!")

            onClose()

        } catch (erro) {
            console.error("Erro ao salvar agendamento:", erro)
            alert("Erro ao conectar com o servidor.")
        }
    }

    return (
        <div>
            <div className="grid grid-cols-2 gap-4">
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
                    {/* Convenio */}
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
                    {/* Local de Atendimento */}
                    <div>
                        <InputSelect
                            icone={<AiOutlineSelect />}
                            id="localDeAtendimento"
                            label="Selecione o Local de Atendimento"
                            nome="localDeAtendimento"
                            setValor={setLocalDeAtendimento}
                            valor={localDeAtendimento}
                            opcoes={
                                convenio === 'REDE_MUNICIPAL'
                                    ? opcoesRedeMunicipal
                                    : opcoesRedeReferenciada
                            }
                        />
                    </div>
                    {/* Prestador */}
                    <div>
                        <InputSelect
                            icone={<AiOutlineSelect />}
                            id="prestador"
                            label="Selecione um prestador"
                            nome="prestador"
                            setValor={setPrestador}
                            valor={prestador}
                            opcoes={opcoesDePrestadores}
                        />
                    </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">

                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                        Calendário
                    </h3>

                    <CalendarioAgenda
                        dataSelecionada={dataSelecionada}
                        onChange={setDataSelecionada}
                    />

                </div>
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
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium ">
                                {agendamento.tipo}
                            </span>
                        </div>
                    </div>

                    {/* Procedimento principal */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-zinc-500">
                                Procedimento
                            </span>
                            <p className="text-sm font-medium text-zinc-800 mt-1">
                                {agendamento.procedimento?.nome || "Não informado"}
                            </p>
                            {agendamento.procedimento?.codigo && (
                                <p className="text-xs text-zinc-500">
                                    Código: {agendamento.procedimento.codigo}
                                </p>
                            )}
                        </div>

                        {/* Procedimento filho */}
                        <div>
                            <span className="text-xs text-zinc-500">
                                Procedimento complementar
                            </span>
                            <p className="text-sm font-medium text-zinc-800 mt-1">
                                {agendamento.procedimentoFilho?.nome || "Não informado"}
                            </p>
                        </div>

                        {/* Especialidade */}
                        <div>
                            <span className="text-xs text-zinc-500">
                                Especialidade
                            </span>

                            <p className="text-sm font-medium text-zinc-800 mt-1">
                                {agendamento.especialidade?.nome || "Não informado"}
                            </p>
                        </div>

                        {/* Especialidade filha */}
                        <div>
                            <span className="text-xs text-zinc-500">
                                Especialidade complementar
                            </span>
                            <p className="text-sm font-medium text-zinc-800 mt-1">
                                {agendamento.especialidadeFilha?.nome || "Não informado"}
                            </p>
                        </div>
                        {/* Lado */}
                        <div>
                            <span className="text-xs text-zinc-500">
                                Lado
                            </span>

                            <p className="text-sm font-medium text-zinc-800 mt-1">
                                {agendamento.lado || "Não informado"}
                            </p>
                        </div>
                        {/* Prioridade */}
                        <div>
                            <span className="text-xs text-zinc-500">
                                Prioridade
                            </span>
                            <div className="mt-1">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold

                            ${agendamento.prioridade === "URGENTE"
                                        ? "bg-red-100 text-red-700"
                                        : agendamento.prioridade === "PRIORIDADE"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-zinc-100 text-zinc-700"
                                    }
                                        `}>
                                    {agendamento.prioridade || "NORMAL"}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Separador */}
                    <div className="border-t border-zinc-200 my-4" />
                    {/* Informações adicionais */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-zinc-500">
                                Tipo de consulta
                            </span>
                            <p className="text-sm font-medium text-zinc-800 mt-1">
                                {agendamento.tipoDeConsulta || "Não se aplica"}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-500">
                                Condição de retorno
                            </span>
                            <p className="text-sm font-medium text-zinc-800 mt-1">
                                {agendamento.condicaoDeRetorno || "Não informado"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-zinc-500">
                                Data de Entrada
                            </span>
                            <p className="text-sm font-medium text-zinc-800 mt-1">
                                25/05/2026
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-500">
                                Dias na fila
                            </span>
                            <p className="text-sm font-medium text-zinc-800 mt-1">
                                62
                            </p>
                        </div>
                    </div>
                </div>
                <div className="border border-zinc-200 rounded-lg p-4 flex flex-col">
                    {/* Cabeçalho */}
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
                    {/* Data selecionada */}
                    <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 mb-3 ">
                        <div>
                            <span className="text-xs text-zinc-500">
                                Data selecionada
                            </span>
                            <p className="text-sm font-semibold text-zinc-800">
                                {dataSelecionada
                                    ? new Date(dataSelecionada).toLocaleDateString('pt-BR')
                                    : 'Selecione uma data'
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
                                    setPeriodo('MANHA')
                                    setHorarioSelecionado('')
                                }}
                                className={`
                                    py-2
                                    rounded-lg
                                    border
                                    text-sm
                                    font-medium
                                    transition
                    ${periodo === 'MANHA'
                                        ? 'bg-green-700 text-white border-green-700'
                                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                                    }
                `}
                            >
                                ☀️ Manhã
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setPeriodo('TARDE')
                                    setHorarioSelecionado('')
                                }}
                                className={`
                                        py-2
                                        rounded-lg
                                        border
                                        text-sm
                                        font-medium
                                        transition
                    ${periodo === 'TARDE'
                                        ? 'bg-green-700 text-white border-green-700'
                                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
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
                    <div className="grid gap-2 overflow-y-auto max-h-[250px] pr-1 ">

                        {(periodo === 'MANHA'
                            ? opcoesDeHorariosDeManha
                            : opcoesDeHorariosDeTarde
                        ).map((horario) => {
                            // futuramente isso virá da API
                            const ocupado = false
                            const selecionado =
                                horarioSelecionado === horario
                            return (
                                <button
                                    key={horario}
                                    type="button"
                                    disabled={ocupado}
                                    onClick={() =>
                                        setHorarioSelecionado(horario)
                                    }
                                    className={`relative flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition
                        ${ocupado ?
                                            `bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed `
                                            : selecionado
                                                ? `bg-green-700 border-green-700 text-white shadow-sm `
                                                :
                                                `bg-white border-zinc-200 text-zinc-700 hover:border-green-500 hover:bg-green-50`
                                        }
                                `
                                    }
                                >
                                    <span className="font-semibold">
                                        {horario}
                                    </span>
                                    <span className={`
                                        w-2 h-2 rounded-full
                                        ${ocupado
                                            ? 'bg-zinc-400'
                                            : selecionado
                                                ? 'bg-white'
                                                : 'bg-green-500'
                                        }`} />
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-4 ml-auto col-span-2">
                    <button className="flex items-center border border-red-500 text-red-500 rounded-lg font-bold text-xl px-4 py-2 gap-2 duration-300 transition-all hover:bg-red-500 hover:text-white">
                        <MdCancel />
                        <p>Cancelar</p>
                    </button>
                    <button onClick={() => handleSalvarAgendamento()} className="flex items-center border border-verde-escuro text-verde-escuro rounded-lg font-bold text-xl px-4 py-2 gap-2 duration-300 transition-all hover:bg-verde-escuro hover:text-white">
                        <RiSave2Line />
                        <p>Salvar</p>
                    </button>
                </div>
            </div>
        </div>
    )
}