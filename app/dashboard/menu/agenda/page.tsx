'use client'
import { BsBuilding, BsCalendar2Date, BsCalendar2Week } from "react-icons/bs";
import Template from "../Template";
import { FaHandHoldingMedical, FaRegCalendarAlt, FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { useLocais } from "@/hooks/useListaDeLocais";
import InputSelect from "@/components/inputs/InputSelect";
import { MdOutlineLocationCity } from "react-icons/md";
import { AgendamentoDePrestador, Local, PeriodoDeAtendimento, TipoDoPrestador } from "@/generated/prisma/browser";
import { AiOutlineClear } from "react-icons/ai";
import { HiSaveAs } from "react-icons/hi";
import { usePrestadores } from "@/hooks/usePrestadores";
import DialogPersonalizado from "@/components/dialog/DialogPersonalizado";
import { useAgendamentoDePrestadores } from "@/hooks/useAgendamentoDePrestadores";
import { FiEdit } from "react-icons/fi";
import { RiExternalLinkFill } from "react-icons/ri";
import Calendario from "@/components/calendario/Calendario";
import { useUsuarios } from "@/hooks/useListaDeUsuarios";
import InputData from "@/components/inputs/InputData";

export default function Page() {
    type AgendamentoDaAgenda = (typeof agendamentoDePrestadores)[number]

    const { usuarios } = useUsuarios()
    const { locais } = useLocais()
    const { prestadores, carregando } = usePrestadores()
    const { agendamentoDePrestadores, buscarAgendamentoDePrestadores } = useAgendamentoDePrestadores()
    const [dialogAgenda, setDialogAgenda] = useState(false)
    const [dataSelecionada, setDataSelecionada] = useState<Date | null>(new Date())
    const [localSelecionado, setLocalSelecionado] = useState<Local | null>(null)
    const [unidadeDeAtendimento, setUnidadeDeAtendimento] = useState<Local | null>(null)

    const [tipoDePrestador, setTipoDePrestador] = useState<TipoDoPrestador>(TipoDoPrestador.MEDICO)
    const [buscarPrestador, setBuscarPrestador] = useState("")
    const [prestadorAtual, setPrestadorAtual] = useState<(typeof prestadores)[number] | null>(null)

    const [periodoDeAtendimento, setPeriodoDeAtendimento] = useState<PeriodoDeAtendimento>(PeriodoDeAtendimento.MANHA)
    const [salaDeAtendimento, setSalaDeAtendimento] = useState<number | null>(null)

    const [dialogConfirmacao, setDialogConfirmacao] = useState(false)
    const [dialogResultado, setDialogResultado] = useState(false)

    const [tituloResultado, setTituloResultado] = useState("")
    const [mensagemResultado, setMensagemResultado] = useState("")

    const [carregandoCadastro, setCarregandoCadastro] = useState(false)
    const [periodoDeAtendimentoDoDiaSelecionado, setPeriodoDeAtendimentoDoDiaSelecionado] = useState<PeriodoDeAtendimento>(PeriodoDeAtendimento.MANHA)
    const [dialogAtualizarAgendamentoPrestador, setDialogAtualizarAgendamentoPrestador] = useState(false)

    const [agendamentoAtual, setAgendamentoAtual] = useState<AgendamentoDaAgenda | null>(null)

    // Edição
    const [editarData, setEditarData] = useState("")
    const [editarPeriodo, setEditarPeriodo] = useState<PeriodoDeAtendimento>(PeriodoDeAtendimento.MANHA)
    const [editarSala, setEditarSala] = useState<number | null>(null)
    const [carregandoEdicao, setCarregandoEdicao] = useState(false)


    const [dialogGerarPdfAgendaDePrestadores, setDialogGerarPdfAgendaDePrestadores] = useState(false)

    // Filtros
    const [dataDeInicio, setDataDeInicio] = useState("")
    const [dataDeFim, setDataDeFim] = useState("")

    // Executa o cadastro após a confirmação
    async function cadastrarAgendamento() {
        try {
            setCarregandoCadastro(true)

            const resposta = await fetch("/api/criar-agendamento-de-prestadores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: formatarData(dataSelecionada!),
                    prestadorId: prestadorAtual!.id,
                    unidadeDeAtendimentoId: unidadeDeAtendimento!.id,
                    periodo: periodoDeAtendimento,
                    salaNumero: salaDeAtendimento,
                }),
            })

            const resultado = await resposta.json()

            setDialogConfirmacao(false)

            if (!resposta.ok) {
                throw new Error(
                    resultado.mensagem || "Não foi possível cadastrar o agendamento."
                )
            }

            await buscarAgendamentoDePrestadores()

            setTituloResultado("Agendamento cadastrado!")
            setMensagemResultado(
                resultado.mensagem || "O atendimento foi cadastrado com sucesso."
            )


            limparAtendimento()
            setSalaDeAtendimento(null)

            setDialogResultado(true)

        } catch (erro) {
            setDialogConfirmacao(false)

            setTituloResultado("Erro ao cadastrar")
            setMensagemResultado(
                erro instanceof Error
                    ? erro.message
                    : "Ocorreu um erro ao cadastrar o agendamento."
            )

            setDialogResultado(true)

        } finally {
            setCarregandoCadastro(false)
        }
    }

    async function atualizarAgendamento() {
        if (!agendamentoAtual) {
            setTituloResultado("Agendamento não selecionado")
            setMensagemResultado("Selecione um agendamento para atualizar.")
            setDialogResultado(true)
            return
        }

        if (!editarData) {
            setTituloResultado("Data não selecionada")
            setMensagemResultado("Selecione uma nova data para o atendimento.")
            setDialogResultado(true)
            return
        }

        if (!editarSala) {
            setTituloResultado("Sala não selecionada")
            setMensagemResultado("Selecione uma sala para o atendimento.")
            setDialogResultado(true)
            return
        }

        try {
            setCarregandoEdicao(true)

            const resposta = await fetch(
                `/api/criar-agendamento-de-prestadores/${agendamentoAtual.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        data: editarData,
                        periodo: editarPeriodo,
                        salaNumero: editarSala,
                    }),
                }
            )

            const resultado = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro ||
                    "Não foi possível atualizar o agendamento."
                )
            }

            // Atualiza a lista de agendamentos
            await buscarAgendamentoDePrestadores()

            // Atualiza a visualização da agenda
            setDataSelecionada(
                new Date(`${editarData}T12:00:00`)
            )

            setPeriodoDeAtendimentoDoDiaSelecionado(editarPeriodo)

            // Fecha o diálogo de edição
            setDialogAtualizarAgendamentoPrestador(false)
            setAgendamentoAtual(null)

            // Exibe o resultado
            setTituloResultado("Agendamento atualizado!")
            setMensagemResultado(
                resultado.mensagem ||
                "O agendamento foi atualizado com sucesso."
            )

            setDialogResultado(true)

        } catch (erro) {
            setTituloResultado("Erro ao atualizar")

            setMensagemResultado(
                erro instanceof Error
                    ? erro.message
                    : "Ocorreu um erro ao atualizar o agendamento."
            )

            setDialogResultado(true)

        } finally {
            setCarregandoEdicao(false)
        }
    }

    function selecionarPrestador(id: number) {
        const prestador = prestadores.find(
            (item) =>
                item.id === id &&
                item.ativo &&
                item.tipo === tipoDePrestador
        )

        if (!prestador) return

        setPrestadorAtual(prestador)
        setBuscarPrestador("")
    }

    function removerPrestador() {
        setPrestadorAtual(null)
        setBuscarPrestador("")
    }

    function limparAtendimento() {
        removerPrestador()
    }

    // Formata a data sem sofrer alteração de fuso horário
    function formatarData(data: Date): string {
        const ano = data.getFullYear()
        const mes = String(data.getMonth() + 1).padStart(2, "0")
        const dia = String(data.getDate()).padStart(2, "0")

        return `${ano}-${mes}-${dia}`
    }

    // Valida os campos e abre a confirmação
    function handleSubmitAgendamento() {
        if (!dataSelecionada) {
            setTituloResultado("Data não selecionada")
            setMensagemResultado("Selecione uma data para o atendimento.")
            setDialogResultado(true)
            return
        }

        if (!prestadorAtual) {
            setTituloResultado("Prestador não selecionado")
            setMensagemResultado("Selecione um médico ou prestador de serviços médicos.")
            setDialogResultado(true)
            return
        }

        if (!unidadeDeAtendimento) {
            setTituloResultado("Unidade não selecionada")
            setMensagemResultado("Selecione uma unidade de atendimento.")
            setDialogResultado(true)
            return
        }

        if (!salaDeAtendimento) {
            setTituloResultado("Sala não selecionada")
            setMensagemResultado("Selecione uma sala para o atendimento.")
            setDialogResultado(true)
            return
        }

        setDialogConfirmacao(true)
    }

    // Cancelamento da confirmação
    function cancelarCadastro() {
        setDialogConfirmacao(false)

        setTituloResultado("Cadastro cancelado")
        setMensagemResultado("O cadastro do agendamento foi cancelado.")

        setDialogResultado(true)
    }

    function formatarDataPersonalizado(data: string | Date): string {
        const dataFormatada = new Date(data)

        return `dia ${new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(dataFormatada)}, ${new Intl.DateTimeFormat("pt-BR", {
            weekday: "long",
        }).format(dataFormatada)}`
    }

    function abrirEdicaoAgendamento(agendamento: AgendamentoDaAgenda) {
        setAgendamentoAtual(agendamento)

        setEditarData(String(agendamento.data).slice(0, 10))
        setEditarPeriodo(agendamento.periodo)
        setEditarSala(agendamento.salaNumero)

        setDialogAtualizarAgendamentoPrestador(true)
    }

    // Agendamentos da unidade, data e período selecionados
    const agendamentosDoDiaPeriodo = (agendamentoDePrestadores ?? []).filter(
        (agendamento) => {
            if (!localSelecionado || !dataSelecionada) return false

            const dataAgendamento = String(agendamento.data).slice(0, 10)
            const dataAtual = formatarData(dataSelecionada)

            return (
                agendamento.unidadeDeAtendimentoId === localSelecionado.id &&
                dataAgendamento === dataAtual &&
                agendamento.periodo === periodoDeAtendimentoDoDiaSelecionado
            )
        }
    )

    const prestadoresFiltrados = prestadores.filter(
        (prestador) =>
            prestador.ativo &&
            prestador.tipo === tipoDePrestador &&
            prestador.nome.toLowerCase().includes(
                buscarPrestador.trim().toLowerCase()
            )
    )

    const listaDeAgendamentosDoDia = (agendamentoDePrestadores ?? []).filter(
        (agendamento) => {
            if (!localSelecionado || !dataSelecionada) return false

            const dataAgendamento = new Date(agendamento.data)
                .toISOString()
                .slice(0, 10)

            const dataAtual = formatarData(dataSelecionada)

            return (
                agendamento.unidadeDeAtendimentoId === localSelecionado.id &&
                dataAgendamento === dataAtual
            )
        }
    )

    const periodos = [
        { valor: PeriodoDeAtendimento.MANHA, nome: "Manhã" },
        { valor: PeriodoDeAtendimento.TARDE, nome: "Tarde" },
        { valor: PeriodoDeAtendimento.NOITE, nome: "Noite" },
    ]

    const eventosCalendario = (agendamentoDePrestadores ?? [])
        .filter((agendamento) =>
            agendamento.unidadeDeAtendimentoId === localSelecionado?.id
        )
        .map((agendamento) => ({
            data: String(agendamento.data).slice(0, 10),
            cor: agendamento.prestador.cor,
            profissional: agendamento.prestador.nome,
        }));

    const buscarUsuarioPorId = (usuarioId: string) => {
        return usuarios.find((usuario) => usuario.id === usuarioId);
    };

    const gerarPdfAgendaDePrestadores = () => {
        if (!dataDeInicio || !dataDeFim) {
            console.error("Informe a data de início e a data de fim.");
            return;
        }

        if (dataDeInicio > dataDeFim) {
            console.error("A data de início não pode ser maior que a data de fim.");
            return;
        }

        if (!localSelecionado) {
            console.error("Nenhuma unidade de atendimento selecionada.");
            return;
        }

        // Filtra os agendamentos da unidade dentro do período informado
        const agendamentosFiltrados = agendamentoDePrestadores
            .filter((agendamento) => {
                const dataAgendamento = String(agendamento.data).slice(0, 10);

                return (
                    agendamento.unidadeDeAtendimentoId === localSelecionado.id &&
                    dataAgendamento >= dataDeInicio &&
                    dataAgendamento <= dataDeFim
                );
            })
            .map((agendamento) => ({
                id: agendamento.id,
                data: agendamento.data,
                periodo: agendamento.periodo,
                salaNumero: agendamento.salaNumero,
                observacoes: agendamento.observacoes,
                prestador: agendamento.prestador,
                unidadeDeAtendimento: agendamento.unidadeDeAtendimento,
                criadoPor: agendamento.criadoPorId,
            }));

        console.log("Iniciando geração do PDF...");
        console.log({
            unidade: localSelecionado.nome,
            dataDeInicio,
            dataDeFim,
            totalAgendamentos: agendamentosFiltrados.length,
            agendamentos: agendamentosFiltrados,
        });
    };

    return (
        <Template>
            <div className="text-verde-escuro flex flex-col gap-4 max-h-[100vh] overflow-y-scroll p-4">
                <div className="flex items-center gap-2">
                    <div className="font-bold text-5xl">
                        <BsCalendar2Week />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl">Agenda</h3>
                        <p>Selecione um local para visualizar e gerenciar a agenda de atendimentos.</p>
                    </div>
                </div>
                <div>
                    <ul className="grid grid-cols-2 gap-4 3xl:grid-cols-3">
                        {
                            locais.map((local) => {
                                return (
                                    <li key={local.id} className="rounded-lg border border-verde-escuro p-4 flex flex-col gap-2 relative">
                                        <div className="text-6xl">
                                            <BsBuilding />
                                        </div>
                                        <h2 className="font-bold text-xl">{local.nome}</h2>
                                        <span className="max-w-[400px]">{local.rua}, {local.numero} - {local.bairro} ({local.complemento})</span>
                                        <p className="mt-auto">
                                            <button className="underline text-lg flex items-center gap-2" onClick={() => {
                                                setDialogGerarPdfAgendaDePrestadores(true)
                                                setLocalSelecionado(local)
                                            }}>
                                                <p>Gerar PDF da agenda</p>
                                                <RiExternalLinkFill />
                                            </button>
                                        </p>
                                        <button
                                            className="flex items-center justify-center gap-2 bg-white border border-verde-escuro cursor-pointer transition-all duration-300 font-bold text-lg py-2 rounded-lg hover:bg-verde-escuro hover:text-white"
                                            onClick={() => {
                                                setLocalSelecionado(local)
                                                setUnidadeDeAtendimento(local)
                                                setDialogAgenda(true)
                                            }}
                                        >
                                            <FaRegCalendarAlt />
                                            <p>Ver Agenda</p>
                                        </button>

                                        <div className="absolute top-2 right-2 w-[60px] h-[60px] flex flex-col justify-center items-center rounded-full p-2 border border-verde-escuro">
                                            <p className="font-semibold text-xs">Salas</p>
                                            <span className="font-bold text-3xl -mt-1">{local.quantidadeDeSalas}</span>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <Dialog header={localSelecionado?.nome} visible={dialogAgenda} className="max-w-[1000px] w-full" onHide={() => { setDialogAgenda(false); setDataSelecionada(new Date()) }}>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex h-full">

                        <Calendario
                            eventos={eventosCalendario}
                            dataSelecionada={dataSelecionada}
                            onSelecionarData={setDataSelecionada}
                        />
                    </div>
                    <div className="p-4 border border-verde-escuro rounded-lg flex flex-col gap-2 text-verde-escuro">
                        <h3>Adicionar Atendimento</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className={`border border-verde-escuro rounded-lg py-1 shadow-[0px_0px_2px_1px_var(--verde-escuro)] ${tipoDePrestador === TipoDoPrestador.MEDICO ? 'bg-verde-escuro text-white' : ''}`} onClick={() => setTipoDePrestador(TipoDoPrestador.MEDICO)}>
                                <p>Médico</p>
                            </button>
                            <button type="button" className={`border border-verde-escuro rounded-lg py-1 shadow-[0px_0px_2px_1px_var(--verde-escuro)] ${tipoDePrestador === TipoDoPrestador.PRESTADOR_DE_SERVICOS_MEDICOS ? 'bg-verde-escuro text-white' : ''}`} onClick={() => setTipoDePrestador(TipoDoPrestador.PRESTADOR_DE_SERVICOS_MEDICOS)}>
                                <p>Prestador de Serviços Médicos</p>
                            </button>
                        </div>
                        {/* Seleção do prestador */}
                        <div className="flex flex-col gap-3">
                            <label
                                htmlFor="buscarPrestador"
                                className="flex items-center gap-2 text-lg font-bold"
                            >
                                <FaHandHoldingMedical className="text-xl" />

                                <h3>
                                    {tipoDePrestador === TipoDoPrestador.MEDICO
                                        ? "Médico:"
                                        : "Prestador de Serviços Médicos:"}
                                </h3>
                            </label>

                            <input
                                id="buscarPrestador"
                                type="text"
                                value={prestadorAtual?.nome ?? buscarPrestador}
                                onChange={(e) => {
                                    setBuscarPrestador(e.target.value)
                                    setPrestadorAtual(null)
                                }}
                                placeholder={
                                    tipoDePrestador === TipoDoPrestador.MEDICO
                                        ? "Digite o nome do médico..."
                                        : "Digite o nome do prestador..."
                                }
                                autoComplete="off"
                                className="w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-verde focus:ring-1 focus:ring-verde"
                            />

                            {/* Resultados da pesquisa */}
                            {buscarPrestador.trim() !== "" && (
                                <div className="border border-zinc-300 rounded-lg overflow-hidden">
                                    {carregando ? (
                                        <p className="p-3 text-sm text-gray-500">
                                            Carregando prestadores...
                                        </p>
                                    ) : prestadoresFiltrados.length > 0 ? (
                                        prestadoresFiltrados.map((prestador) => (
                                            <button
                                                key={prestador.id}
                                                type="button"
                                                onClick={() =>
                                                    selecionarPrestador(prestador.id)
                                                }
                                                className="w-full text-left px-3 py-2 hover:bg-verde/10 transition-colors border-b last:border-b-0"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-3 h-3 rounded-full"
                                                        style={{
                                                            backgroundColor: prestador.cor,
                                                        }}
                                                    />

                                                    <span className="font-medium">
                                                        {prestador.nome}
                                                    </span>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="p-3 text-sm text-gray-500">
                                            Nenhum prestador encontrado.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Prestador selecionado */}
                            {prestadorAtual && (
                                <div className="flex items-center justify-between gap-3 bg-verde/10 border border-verde rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="w-4 h-4 rounded-full"
                                            style={{
                                                backgroundColor: prestadorAtual.cor,
                                            }}
                                        />

                                        <div>
                                            <p className="font-semibold">
                                                {prestadorAtual.nome}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {prestadorAtual.tipo === TipoDoPrestador.MEDICO
                                                    ? "Médico"
                                                    : "Prestador de Serviços Médicos"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={removerPrestador}
                                        className="text-red-600 font-bold text-xl"
                                        title="Remover prestador"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                        <InputSelect icone={<MdOutlineLocationCity />} id="unidadeDeAtendimento" label="Selecione a unidade de atendimento" nome="unidadeDeAtendimento" setValor={setUnidadeDeAtendimento} valor={unidadeDeAtendimento} opcoes={[{ valor: localSelecionado ?? null, label: localSelecionado?.nome ?? "" }]} />

                        <div className="flex flex-col gap-2">
                            <p>Periodo de atendimento:</p>
                            <div className="grid grid-cols-3 gap-2">
                                <button type="button" className={`border border-verde-escuro rounded-lg py-1 shadow-[0px_0px_2px_1px_var(--verde-escuro)] ${periodoDeAtendimento === PeriodoDeAtendimento.MANHA ? 'bg-verde-escuro text-white' : ''}`} onClick={() => setPeriodoDeAtendimento(PeriodoDeAtendimento.MANHA)}>
                                    <p>Manhã</p>
                                </button>
                                <button type="button" className={`border border-verde-escuro rounded-lg py-1 shadow-[0px_0px_2px_1px_var(--verde-escuro)] ${periodoDeAtendimento === PeriodoDeAtendimento.TARDE ? 'bg-verde-escuro text-white' : ''}`} onClick={() => setPeriodoDeAtendimento(PeriodoDeAtendimento.TARDE)}>
                                    <p>Tarde</p>
                                </button>
                                <button type="button" className={`border border-verde-escuro rounded-lg py-1 shadow-[0px_0px_2px_1px_var(--verde-escuro)] ${periodoDeAtendimento === PeriodoDeAtendimento.NOITE ? 'bg-verde-escuro text-white' : ''}`} onClick={() => setPeriodoDeAtendimento(PeriodoDeAtendimento.NOITE)}>
                                    <p>Noite</p>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p>Selecione uma sala:</p>

                            <ul className="grid grid-cols-5 gap-2">
                                {Array.from(
                                    { length: localSelecionado?.quantidadeDeSalas ?? 0 },
                                    (_, index) => (
                                        <li key={index}>
                                            <button
                                                type="button"
                                                className={`border border-verde-escuro rounded-lg w-[70px] h-[40px] shadow-[0px_0px_2px_1px_var(--verde-escuro)] ${salaDeAtendimento === index + 1
                                                    ? "bg-verde-escuro text-white"
                                                    : ""
                                                    }`}
                                                onClick={() => setSalaDeAtendimento(index + 1)}
                                            >
                                                Sala {index + 1}
                                            </button>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div className="flex items-center gap-3 ml-auto mt-auto">
                            <button
                                type="button"
                                onClick={() => {
                                    limparAtendimento()
                                    setSalaDeAtendimento(null)
                                }}
                                className="flex items-center gap-2 font-bold rounded-lg border border-red-600 text-red-600 p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-red-600"
                            >
                                <AiOutlineClear className="text-2xl" />
                                <p>Limpar</p>
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmitAgendamento}
                                disabled={carregandoCadastro}
                                className="flex items-center gap-2 font-bold rounded-lg border border-verde p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-verde disabled:opacity-50"
                            >
                                <HiSaveAs className="text-2xl" />
                                <p>Salvar</p>
                            </button>
                        </div>
                    </div>
                    <div className="col-span-2 p-4 border border-verde-escuro rounded-lg flex flex-col gap-6 text-verde-escuro h-fit">
                        <div>
                            <h2 className="capitalize font-bold text-2xl">{formatarDataPersonalizado(dataSelecionada!)}</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button type="button" className={`border border-verde-escuro rounded-lg py-1 shadow-[0px_0px_2px_1px_var(--verde-escuro)] ${periodoDeAtendimentoDoDiaSelecionado === PeriodoDeAtendimento.MANHA ? 'bg-verde-escuro text-white' : ''}`} onClick={() => setPeriodoDeAtendimentoDoDiaSelecionado(PeriodoDeAtendimento.MANHA)}>
                                <p>Manhã</p>
                            </button>
                            <button type="button" className={`border border-verde-escuro rounded-lg py-1 shadow-[0px_0px_2px_1px_var(--verde-escuro)] ${periodoDeAtendimentoDoDiaSelecionado === PeriodoDeAtendimento.TARDE ? 'bg-verde-escuro text-white' : ''}`} onClick={() => setPeriodoDeAtendimentoDoDiaSelecionado(PeriodoDeAtendimento.TARDE)}>
                                <p>Tarde</p>
                            </button>
                            <button type="button" className={`border border-verde-escuro rounded-lg py-1 shadow-[0px_0px_2px_1px_var(--verde-escuro)] ${periodoDeAtendimentoDoDiaSelecionado === PeriodoDeAtendimento.NOITE ? 'bg-verde-escuro text-white' : ''}`} onClick={() => setPeriodoDeAtendimentoDoDiaSelecionado(PeriodoDeAtendimento.NOITE)}>
                                <p>Noite</p>
                            </button>
                        </div>
                        <div>
                            <ul className="grid grid-cols-4 w-full gap-4">
                                {Array.from(
                                    { length: localSelecionado?.quantidadeDeSalas ?? 0 },
                                    (_, index) => {
                                        const numeroSala = index + 1

                                        const agendamento = agendamentosDoDiaPeriodo.find(
                                            (item) => item.salaNumero === numeroSala
                                        )

                                        const usuario = buscarUsuarioPorId(agendamento?.criadoPorId!)

                                        return (
                                            <li
                                                key={numeroSala}
                                                className={`rounded-lg border p-4 flex flex-col gap-2 min-h-[140px] ${agendamento
                                                    ? "border-verde-escuro"
                                                    : "border-zinc-300"
                                                    }`}
                                            >
                                                {/* Identificação da sala */}
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <button
                                                            type="button"
                                                            disabled={!agendamento}
                                                            className="rounded-lg border border-amber-600 text-amber-600 p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                                                            onClick={() => abrirEdicaoAgendamento(agendamento!)}
                                                        >
                                                            <FiEdit />
                                                        </button>
                                                        <button className="rounded-lg border border-red-600 text-red-600 p-2">
                                                            <FaRegTrashAlt />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm">
                                                        Sala {numeroSala}
                                                    </p>
                                                </div>

                                                {agendamento ? (
                                                    <>
                                                        <h3 className="font-bold text-xl">
                                                            {agendamento.prestador.nome}
                                                        </h3>

                                                        <span className="text-lg truncate">
                                                            {agendamento.prestador.tipo === TipoDoPrestador.MEDICO
                                                                ? "Médico"
                                                                : "Prestador de Serviços Médicos"}
                                                        </span>
                                                        <div>
                                                            <p className="line-clamp-1 text-xs">Criado por {usuario?.nome}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <h3 className="font-bold text-xl mx-auto my-auto">
                                                        VAZIO
                                                    </h3>
                                                )}
                                            </li>
                                        )
                                    }
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-2 p-4 border border-verde-escuro rounded-lg flex flex-col gap-6 text-verde-escuro h-fit">
                        <div className="flex flex-col gap-4">
                            <h2 className="capitalize font-bold text-xl text-center">Lista de todos os agendamentos do {formatarDataPersonalizado(dataSelecionada!)}</h2>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3">Cor</th>
                                        <th className="text-left p-3">Prestador</th>
                                        <th className="text-left p-3">Especialidade</th>
                                        <th className="text-left p-3">Período</th>
                                        <th className="text-left p-3">Sala</th>
                                        <th className="text-left p-3">Criado Por</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {periodos.flatMap((periodo) =>
                                        Array.from(
                                            { length: localSelecionado?.quantidadeDeSalas ?? 0 },
                                            (_, index) => index + 1
                                        ).map((numeroSala) => {
                                            const agendamento = listaDeAgendamentosDoDia.find(
                                                (item) =>
                                                    item.salaNumero === numeroSala &&
                                                    item.periodo === periodo.valor
                                            )
                                            const usuario = buscarUsuarioPorId(agendamento?.criadoPorId!)
                                            return (
                                                <tr
                                                    key={`${periodo.valor}-${numeroSala}`}
                                                    className="border-b"
                                                >
                                                    <td className="p-3">
                                                        {
                                                            agendamento?.prestador ? (
                                                                <div className="rounded-full w-4 h-4" style={{ backgroundColor: `${agendamento?.prestador.cor}` }} />

                                                            ) : (
                                                                <div className="rounded-full w-4 h-4 bg-zinc-300 shadow-[0px_0px_2px_1px_#999]" />
                                                            )
                                                        }
                                                    </td>
                                                    <td className="p-3">
                                                        {agendamento?.prestador.nome ?? "Vazio"}
                                                    </td>

                                                    <td className="p-3">
                                                        {agendamento?.prestador.especialidades?.[0]?.especialidade?.nome ?? "Vazio"}
                                                    </td>

                                                    <td className="p-3">
                                                        {periodo.nome}
                                                    </td>

                                                    <td className="p-3">
                                                        Sala {numeroSala}
                                                    </td>
                                                    <td className="p-3 max-w-[100px] truncate">
                                                        {usuario?.nome}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog
                header="Editar agendamento"
                visible={dialogAtualizarAgendamentoPrestador}
                className="max-w-[700px] w-full"
                onHide={() => {
                    setDialogAtualizarAgendamentoPrestador(false)
                    setAgendamentoAtual(null)
                }}
            >
                {agendamentoAtual && (
                    <div className="flex flex-col gap-5 mt-3">

                        {/* Prestador atual */}
                        <div className="flex flex-col gap-1 p-3 rounded-lg bg-gray-100">
                            <span className="text-sm text-gray-500">
                                Prestador
                            </span>

                            <h3 className="font-bold text-lg">
                                {agendamentoAtual.prestador.nome}
                            </h3>

                            <span className="text-sm text-gray-600">
                                {agendamentoAtual.prestador.tipo === TipoDoPrestador.MEDICO
                                    ? "Médico"
                                    : "Prestador de Serviços Médicos"}
                            </span>
                        </div>

                        {/* Nova data */}
                        <div className="flex flex-col gap-2">
                            <label className="font-medium">
                                Nova data de atendimento
                            </label>

                            <input
                                type="date"
                                value={editarData}
                                onChange={(e) => setEditarData(e.target.value)}
                                className="border rounded-lg p-3 w-full"
                            />
                        </div>

                        {/* Novo período */}
                        <div className="flex flex-col gap-2">
                            <label className="font-medium">
                                Novo período de atendimento
                            </label>

                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { valor: PeriodoDeAtendimento.MANHA, nome: "Manhã" },
                                    { valor: PeriodoDeAtendimento.TARDE, nome: "Tarde" },
                                    { valor: PeriodoDeAtendimento.NOITE, nome: "Noite" },
                                ].map((periodo) => (
                                    <button
                                        key={periodo.valor}
                                        type="button"
                                        onClick={() => setEditarPeriodo(periodo.valor)}
                                        className={`border border-verde-escuro rounded-lg py-2 ${editarPeriodo === periodo.valor
                                            ? "bg-verde-escuro text-white"
                                            : ""
                                            }`}
                                    >
                                        {periodo.nome}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Nova sala */}
                        <div className="flex flex-col gap-2">
                            <label className="font-medium">
                                Nova sala de atendimento
                            </label>

                            <div className="grid grid-cols-5 gap-2">
                                {Array.from(
                                    {
                                        length: localSelecionado?.quantidadeDeSalas ?? 0,
                                    },
                                    (_, index) => {
                                        const numeroSala = index + 1

                                        return (
                                            <button
                                                key={numeroSala}
                                                type="button"
                                                onClick={() => setEditarSala(numeroSala)}
                                                className={`border border-verde-escuro rounded-lg py-2 ${editarSala === numeroSala
                                                    ? "bg-verde-escuro text-white"
                                                    : ""
                                                    }`}
                                            >
                                                Sala {numeroSala}
                                            </button>
                                        )
                                    }
                                )}
                            </div>
                        </div>

                        {/* Ações */}
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setDialogAtualizarAgendamentoPrestador(false)
                                    setAgendamentoAtual(null)
                                }}
                                className="border rounded-lg px-4 py-2"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={atualizarAgendamento}
                                disabled={
                                    !editarData ||
                                    !editarSala ||
                                    carregandoEdicao
                                }
                                className="bg-verde-escuro text-white rounded-lg px-4 py-2 disabled:opacity-50"
                            >
                                {carregandoEdicao
                                    ? "Salvando..."
                                    : "Salvar alterações"}
                            </button>
                        </div>
                    </div>
                )}
            </Dialog>


            {/* Diálogo de confirmação */}
            <DialogPersonalizado
                visivel={dialogConfirmacao}
                titulo="Confirmar agendamento"
                mensagem={`Deseja cadastrar o atendimento de ${prestadorAtual?.nome} para o dia ${dataSelecionada?.toLocaleDateString("pt-BR")
                    }, na ${salaDeAtendimento ? `Sala ${salaDeAtendimento}` : ""}?`}
                textoConfirmar={carregandoCadastro ? "Cadastrando..." : "Confirmar"}
                textoCancelar="Cancelar"
                aoConfirmar={cadastrarAgendamento}
                aoCancelar={cancelarCadastro}
            />

            {/* Diálogo de resultado */}
            <DialogPersonalizado
                visivel={dialogResultado}
                titulo={tituloResultado}
                mensagem={mensagemResultado}
                textoConfirmar="Fechar"
                mostrarCancelar={false}
                aoConfirmar={() => setDialogResultado(false)}
                aoCancelar={() => setDialogResultado(false)}
            />


            <Dialog
                header={`Gerar PDF do Agendamento do ${localSelecionado?.nome}`}
                visible={dialogGerarPdfAgendaDePrestadores}
                className="max-w-[700px] w-full"
                onHide={() => {
                    setDialogGerarPdfAgendaDePrestadores(false)
                    setDataDeInicio('')
                    setDataDeFim('')
                }}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-verde-escuro rounded-lg flex flex-col gap-2 text-verde-escuro">

                    </div>
                    <div className="p-4 border border-verde-escuro rounded-lg flex flex-col gap-2 text-verde-escuro">
                        <InputData icone={<BsCalendar2Date />} id="dataDeInicio" label="Data de Início" nome="dataDeInicio" placeholder="Informe a data de Inicio" setValor={setDataDeInicio} valor={dataDeInicio} />
                        <InputData icone={<BsCalendar2Date />} id="dataDeFim" label="Data de Início" nome="dataDeFim" placeholder="Informe a data do fim" setValor={setDataDeFim} valor={dataDeFim} />
                        <button
                            onClick={gerarPdfAgendaDePrestadores}
                            className="flex items-center justify-center gap-2 bg-verde-escuro text-white mt-4 border border-verde-escuro cursor-pointer transition-all duration-300 font-bold text-lg py-2 rounded-lg"
                        >
                            <FaRegCalendarAlt />
                            <p>Gerar PDF</p>
                        </button>
                    </div>
                </div>
            </Dialog>

        </Template >
    )
}