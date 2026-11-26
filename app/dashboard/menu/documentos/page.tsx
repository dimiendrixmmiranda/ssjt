
'use client'

import { HiOutlineDocumentReport, HiSaveAs } from "react-icons/hi"
import Template from "../Template"
import { useState } from "react"
import { GrDocumentPdf } from "react-icons/gr"
import { IoCalendarNumberOutline } from "react-icons/io5"
import { FaRegEye } from "react-icons/fa"
import { Dialog } from "primereact/dialog"
import InputSelect from "@/components/inputs/InputSelect"
import { AiOutlineClear, AiOutlineSelect } from "react-icons/ai"
import { opcoesDeLocais } from "@/constants/dados"
import { useLocais } from "@/hooks/useListaDeLocais"
import { BsCardText } from "react-icons/bs"
import InputTexto from "@/components/inputs/InputTexto"
import { pdf } from "@react-pdf/renderer"

import PreparoDraJessika from "@/components/pdf/documentosPDF/PreparoDraJessika"
import EtiquetaHectorNeurologista from "@/components/pdf/documentosPDF/EtiquetaHectorNeurologista"
import EtiquetaGastro from "@/components/pdf/documentosPDF/EtiquetaGastro"
import EtiquetaAdrianaGineco from "@/components/pdf/documentosPDF/EtiquetaAdrianaGineco"
import EtiquetaMarioVascular from "@/components/pdf/documentosPDF/EtiquetaMarioVascular"
import EtiquetaDermatoMariana from "@/components/pdf/documentosPDF/EtiquetaMarianaDermato"
import { TiEdit } from "react-icons/ti"
import ProtocoloHospitalDoOlho from "@/components/pdf/documentosPDF/ProtocoloDeAgendamentoHospitalDoOlho"
import VisualizadorPDF from "@/components/pdf/VisualizadorPDF"
import { useMemo } from "react"

type TipoDocumento =
    | "PROTOCOLO_AGENDAMENTO_HOSPITAL_DO_OLHO"
    | "PREPARO_DOUTORA_JESSIKA_PSIQUIATRA"
    | "ETIQUETA_DR_HECTOR_NEUROLOGIA"
    | "ETIQUETA_DR_ANTONELY_GASTRO"
    | "ETIQUETA_DR_ADRIANA_GINECO"
    | "ETIQUETA_DR_MARIO_VASCULAR"
    | "ETIQUETA_DR_MARIANA_DERMATO"

export default function Page() {
    const { locais } = useLocais()

    const opcoesUnidadesDoCliente = opcoesDeLocais(locais)

    const [buscarDocumento, setBuscarDocumento] = useState("")
    const [dialogDocumentoSelecionado, setDialogDocumentoSelecionado] = useState(false)
    const [documentoSelecionado, setDocumentoSelecionado] = useState<TipoDocumento | "">("")

    // Estados do formulário
    const [localDeAtendimento, setLocalDeAtendimento] = useState<string | number | null>(null)
    const [quantidadeDeEtiquetas, setQuantidadeDeEtiquetas] = useState("1")
    const [dataDaConsulta, setDataDaConsulta] = useState("")
    const [horarioDaConsulta, setHorarioDaConsulta] = useState("")

    const [nomeDoPaciente, setNomeDoPaciente] = useState("")
    const [dataDeNascimentoDoPaciente, setDataDeNascimentoDoPaciente] = useState("")
    const [dataDeAgendamento, setDataDeAgendamento] = useState("")
    const [horaDoAgendamento, setHoraDoAgendamento] = useState("")
    const [enderecoDoPaciente, setEnderecoDoPaciente] = useState("")
    const [agenteComunitario, setAgenteComunitario] = useState("")


    const nomeLocalSelecionado = locais.find(
        (local) => String(local.id) === String(localDeAtendimento)
    )?.nome ?? ""

    // Documentos que precisam de data e horário
    const documentosComDataEHora: TipoDocumento[] = [
        "ETIQUETA_DR_HECTOR_NEUROLOGIA",
        "ETIQUETA_DR_ANTONELY_GASTRO",
        "ETIQUETA_DR_ADRIANA_GINECO",
        "ETIQUETA_DR_MARIO_VASCULAR",
        "ETIQUETA_DR_MARIANA_DERMATO"
    ]

    const documentoExigeDataEHora = documentosComDataEHora.includes(
        documentoSelecionado as TipoDocumento
    )

    const limparFormularioDocumento = () => {
        setLocalDeAtendimento(null)
        setQuantidadeDeEtiquetas("1")
        setDataDaConsulta("")
        setHorarioDaConsulta("")
    }

    const formatarData = (valor: string) => {
        const numeros = valor.replace(/\D/g, "").slice(0, 8)

        if (numeros.length <= 2) return numeros

        if (numeros.length <= 4) {
            return `${numeros.slice(0, 2)}/${numeros.slice(2)}`
        }

        return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`
    }

    const salvarDocumento = async () => {
        const quantidade = Number(quantidadeDeEtiquetas)

        if (!Number.isInteger(quantidade) || quantidade < 1) {
            alert("Informe uma quantidade válida de etiquetas.")
            return
        }

        if (
            documentoExigeDataEHora &&
            (
                dataDaConsulta.length !== 10 ||
                !horarioDaConsulta
            )
        ) {
            alert("Informe a data e o horário da consulta.")
            return
        }

        try {
            let documento
            let nomeArquivo = ""

            switch (documentoSelecionado) {
                case "PROTOCOLO_AGENDAMENTO_HOSPITAL_DO_OLHO":
                    documento = pdf(
                        <ProtocoloHospitalDoOlho
                            quantidade={quantidade}
                            nomeDoPaciente={nomeDoPaciente}
                            dataDeNascimentoDoPaciente={dataDeNascimentoDoPaciente}
                            dataDeAgendamento={dataDeAgendamento}
                            horaDoAgendamento={horaDoAgendamento}
                            enderecoDoPaciente={enderecoDoPaciente}
                            agenteComunitario={agenteComunitario}
                        />
                    )

                    nomeArquivo = `protocolo-hospital-do-olho-${quantidade}-etiquetas.pdf`
                    break
                case "PREPARO_DOUTORA_JESSIKA_PSIQUIATRA":
                    documento = pdf(
                        <PreparoDraJessika
                            local={nomeLocalSelecionado}
                            quantidade={quantidade}
                        />
                    )

                    nomeArquivo = `preparo-dra-jessika-${quantidade}-etiquetas.pdf`
                    break

                case "ETIQUETA_DR_HECTOR_NEUROLOGIA":
                    documento = pdf(
                        <EtiquetaHectorNeurologista
                            local={nomeLocalSelecionado}
                            quantidade={quantidade}
                            data={dataDaConsulta}
                            hora={horarioDaConsulta}
                        />
                    )

                    nomeArquivo = `etiqueta-dr-hector-${quantidade}-etiquetas.pdf`
                    break

                case "ETIQUETA_DR_ANTONELY_GASTRO":
                    documento = pdf(
                        <EtiquetaGastro
                            local={nomeLocalSelecionado}
                            quantidade={quantidade}
                            data={dataDaConsulta}
                            hora={horarioDaConsulta}
                        />
                    )

                    nomeArquivo = `etiqueta-dr-antonely-gastro-${quantidade}-etiquetas.pdf`
                    break

                case "ETIQUETA_DR_ADRIANA_GINECO":
                    documento = pdf(
                        <EtiquetaAdrianaGineco
                            local={nomeLocalSelecionado}
                            quantidade={quantidade}
                            data={dataDaConsulta}
                            hora={horarioDaConsulta}
                        />
                    )

                    nomeArquivo = `etiqueta-dra-adriana-gineco-${quantidade}-etiquetas.pdf`
                    break
                case "ETIQUETA_DR_MARIO_VASCULAR":
                    documento = pdf(
                        <EtiquetaMarioVascular
                            local={nomeLocalSelecionado}
                            quantidade={quantidade}
                            data={dataDaConsulta}
                            hora={horarioDaConsulta}
                        />
                    )

                    nomeArquivo = `etiqueta-dra-adriana-gineco-${quantidade}-etiquetas.pdf`
                    break
                case "ETIQUETA_DR_MARIANA_DERMATO":
                    documento = pdf(
                        <EtiquetaDermatoMariana
                            local={nomeLocalSelecionado}
                            quantidade={quantidade}
                            data={dataDaConsulta}
                            hora={horarioDaConsulta}
                        />
                    )

                    nomeArquivo = `etiqueta-dra-adriana-gineco-${quantidade}-etiquetas.pdf`
                    break

                default:
                    alert("Selecione um documento válido.")
                    return
            }

            const arquivo = await documento.toBlob()
            const url = URL.createObjectURL(arquivo)

            const link = document.createElement("a")
            link.href = url
            link.download = nomeArquivo

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            setTimeout(() => URL.revokeObjectURL(url), 1000)

        } catch (erro) {
            console.error("Erro ao gerar documento:", erro)
            alert("Não foi possível gerar o PDF.")
        }
    }

    const documentoParaVisualizar = useMemo(() => {
        const quantidade = Math.max(1, Number(quantidadeDeEtiquetas) || 1)

        switch (documentoSelecionado) {
            case "PROTOCOLO_AGENDAMENTO_HOSPITAL_DO_OLHO":
                return (
                    <ProtocoloHospitalDoOlho
                        quantidade={quantidade}
                        nomeDoPaciente={nomeDoPaciente}
                        dataDeNascimentoDoPaciente={dataDeNascimentoDoPaciente}
                        dataDeAgendamento={dataDeAgendamento}
                        horaDoAgendamento={horaDoAgendamento}
                        enderecoDoPaciente={enderecoDoPaciente}
                        agenteComunitario={agenteComunitario}
                    />
                )

            case "PREPARO_DOUTORA_JESSIKA_PSIQUIATRA":
                return (
                    <PreparoDraJessika
                        local={nomeLocalSelecionado || "SELECIONE A UNIDADE"}
                        quantidade={quantidade}
                    />
                )

            case "ETIQUETA_DR_HECTOR_NEUROLOGIA":
                return (
                    <EtiquetaHectorNeurologista
                        local={nomeLocalSelecionado || "SELECIONE A UNIDADE"}
                        quantidade={quantidade}
                        data={dataDaConsulta || "DD/MM/AAAA"}
                        hora={horarioDaConsulta || "00:00"}
                    />
                )

            case "ETIQUETA_DR_ANTONELY_GASTRO":
                return (
                    <EtiquetaGastro
                        local={nomeLocalSelecionado || "SELECIONE A UNIDADE"}
                        quantidade={quantidade}
                        data={dataDaConsulta || "DD/MM/AAAA"}
                        hora={horarioDaConsulta || "00:00"}
                    />
                )

            case "ETIQUETA_DR_ADRIANA_GINECO":
                return (
                    <EtiquetaAdrianaGineco
                        local={nomeLocalSelecionado || "SELECIONE A UNIDADE"}
                        quantidade={quantidade}
                        data={dataDaConsulta || "DD/MM/AAAA"}
                        hora={horarioDaConsulta || "00:00"}
                    />
                )

            case "ETIQUETA_DR_MARIO_VASCULAR":
                return (
                    <EtiquetaMarioVascular
                        local={nomeLocalSelecionado || "SELECIONE A UNIDADE"}
                        quantidade={quantidade}
                        data={dataDaConsulta || "DD/MM/AAAA"}
                        hora={horarioDaConsulta || "00:00"}
                    />
                )

            case "ETIQUETA_DR_MARIANA_DERMATO":
                return (
                    <EtiquetaDermatoMariana
                        local={nomeLocalSelecionado || "SELECIONE A UNIDADE"}
                        quantidade={quantidade}
                        data={dataDaConsulta || "DD/MM/AAAA"}
                        hora={horarioDaConsulta || "00:00"}
                    />
                )

            default:
                return null
        }
    }, [
        documentoSelecionado,
        quantidadeDeEtiquetas,
        nomeDoPaciente,
        dataDeNascimentoDoPaciente,
        dataDeAgendamento,
        horaDoAgendamento,
        enderecoDoPaciente,
        agenteComunitario,
        nomeLocalSelecionado,
        dataDaConsulta,
        horarioDaConsulta
    ])

    return (
        <Template>
            <div className="p-4 text-verde-escuro flex flex-col gap-4 h-full">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center my-auto gap-2 text-verde-escuro">
                        <HiOutlineDocumentReport className="text-5xl" />

                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold">
                                Documentos
                            </h3>

                            <p className="-mt-1">
                                Biblioteca de documentos e orientações da Secretaria municipal de Saúde.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista de documentos */}
                <div className="flex flex-col gap-4">

                    <div className="flex items-center gap-2">
                        <div className="w-2 h-full bg-verde" />
                        <h4 className="text-2xl font-bold">
                            Documentos Recentes
                        </h4>
                    </div>

                    <div>
                        <input
                            className="border border-verde bg-verde/20 text-black p-2 text-lg rounded-lg w-full pl-10"
                            placeholder="Buscar por nome do prestador ou especialidade..."
                            type="search"
                            name="buscarDocumento"
                            id="buscarDocumento"
                            value={buscarDocumento}
                            onChange={(e) => setBuscarDocumento(e.target.value)}
                        />
                    </div>

                    <div>
                        <ul className="flex flex-col gap-3 max-h-[75vh] overflow-y-scroll">

                            {/* Hospital do Olho */}
                            <li className="flex items-center gap-4 p-4 border border-verde rounded-lg">
                                <div className="text-5xl">
                                    <GrDocumentPdf />
                                </div>

                                <div>
                                    <h4 className="font-bold text-2xl">
                                        Protocolo Hospital do Olho
                                    </h4>
                                    <span>
                                        Protocolo de agendamento do Hospital do Olho
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 text-lg text-zinc-600 ml-auto">
                                    <IoCalendarNumberOutline />
                                    <span>24/11/2026</span>
                                </div>

                                <button
                                    type="button"
                                    className="flex items-center gap-2 p-2 rounded-2xl border border-verde font-semibold transition-all duration-300 hover:bg-verde/80 hover:text-white"
                                    onClick={() => {
                                        limparFormularioDocumento()
                                        setDocumentoSelecionado("PROTOCOLO_AGENDAMENTO_HOSPITAL_DO_OLHO")
                                        setDialogDocumentoSelecionado(true)
                                    }}
                                >
                                    <FaRegEye />
                                    <p>Visualizar</p>
                                </button>
                            </li>
                            {/* Jessika */}
                            <li className="flex items-center gap-4 p-4 border border-verde rounded-lg">
                                <div className="text-5xl">
                                    <GrDocumentPdf />
                                </div>

                                <div>
                                    <h4 className="font-bold text-2xl">
                                        Preparo Doutora Jessika Psiquiatra.
                                    </h4>
                                    <span>
                                        Orientações para consulta com a Psiquiatra.
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 text-lg text-zinc-600 ml-auto">
                                    <IoCalendarNumberOutline />
                                    <span>24/11/2026</span>
                                </div>

                                <button
                                    type="button"
                                    className="flex items-center gap-2 p-2 rounded-2xl border border-verde font-semibold transition-all duration-300 hover:bg-verde/80 hover:text-white"
                                    onClick={() => {
                                        limparFormularioDocumento()
                                        setDocumentoSelecionado("PREPARO_DOUTORA_JESSIKA_PSIQUIATRA")
                                        setDialogDocumentoSelecionado(true)
                                    }}
                                >
                                    <FaRegEye />
                                    <p>Visualizar</p>
                                </button>
                            </li>

                            {/* Hector */}
                            <li className="flex items-center gap-4 p-4 border border-verde rounded-lg">
                                <div className="text-5xl">
                                    <GrDocumentPdf />
                                </div>

                                <div>
                                    <h4 className="font-bold text-2xl">
                                        Etiqueta DR Hector Neurologia
                                    </h4>
                                    <span>
                                        Orientações gerais, com data, hora e local da consulta.
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 text-lg text-zinc-600 ml-auto">
                                    <IoCalendarNumberOutline />
                                    <span>24/11/2026</span>
                                </div>

                                <button
                                    type="button"
                                    className="flex items-center gap-2 p-2 rounded-2xl border border-verde font-semibold transition-all duration-300 hover:bg-verde/80 hover:text-white"
                                    onClick={() => {
                                        limparFormularioDocumento()
                                        setDocumentoSelecionado("ETIQUETA_DR_HECTOR_NEUROLOGIA")
                                        setDialogDocumentoSelecionado(true)
                                    }}
                                >
                                    <FaRegEye />
                                    <p>Visualizar</p>
                                </button>
                            </li>

                            {/* Antonely */}
                            <li className="flex items-center gap-4 p-4 border border-verde rounded-lg">
                                <div className="text-5xl">
                                    <GrDocumentPdf />
                                </div>

                                <div>
                                    <h4 className="font-bold text-2xl">
                                        Etiqueta DR Antonely Gastro
                                    </h4>
                                    <span>
                                        Orientações gerais, com data, hora e local da consulta.
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 text-lg text-zinc-600 ml-auto">
                                    <IoCalendarNumberOutline />
                                    <span>24/11/2026</span>
                                </div>

                                <button
                                    type="button"
                                    className="flex items-center gap-2 p-2 rounded-2xl border border-verde font-semibold transition-all duration-300 hover:bg-verde/80 hover:text-white"
                                    onClick={() => {
                                        limparFormularioDocumento()
                                        setDocumentoSelecionado("ETIQUETA_DR_ANTONELY_GASTRO")
                                        setDialogDocumentoSelecionado(true)
                                    }}
                                >
                                    <FaRegEye />
                                    <p>Visualizar</p>
                                </button>
                            </li>

                            {/* Adriana */}
                            <li className="flex items-center gap-4 p-4 border border-verde rounded-lg">
                                <div className="text-5xl">
                                    <GrDocumentPdf />
                                </div>

                                <div>
                                    <h4 className="font-bold text-2xl">
                                        Etiqueta DR Adriana Ginecologista
                                    </h4>
                                    <span>
                                        Orientações gerais, com data, hora e local da consulta.
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 text-lg text-zinc-600 ml-auto">
                                    <IoCalendarNumberOutline />
                                    <span>24/11/2026</span>
                                </div>

                                <button
                                    type="button"
                                    className="flex items-center gap-2 p-2 rounded-2xl border border-verde font-semibold transition-all duration-300 hover:bg-verde/80 hover:text-white"
                                    onClick={() => {
                                        limparFormularioDocumento()
                                        setDocumentoSelecionado("ETIQUETA_DR_ADRIANA_GINECO")
                                        setDialogDocumentoSelecionado(true)
                                    }}
                                >
                                    <FaRegEye />
                                    <p>Visualizar</p>
                                </button>
                            </li>

                            {/* Mario */}
                            <li className="flex items-center gap-4 p-4 border border-verde rounded-lg">
                                <div className="text-5xl">
                                    <GrDocumentPdf />
                                </div>

                                <div>
                                    <h4 className="font-bold text-2xl">
                                        Etiqueta DR Mario Vascular
                                    </h4>
                                    <span>
                                        Orientações gerais, com data, hora e local da consulta.
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 text-lg text-zinc-600 ml-auto">
                                    <IoCalendarNumberOutline />
                                    <span>24/11/2026</span>
                                </div>

                                <button
                                    type="button"
                                    className="flex items-center gap-2 p-2 rounded-2xl border border-verde font-semibold transition-all duration-300 hover:bg-verde/80 hover:text-white"
                                    onClick={() => {
                                        limparFormularioDocumento()
                                        setDocumentoSelecionado("ETIQUETA_DR_MARIO_VASCULAR")
                                        setDialogDocumentoSelecionado(true)
                                    }}
                                >
                                    <FaRegEye />
                                    <p>Visualizar</p>
                                </button>
                            </li>

                            {/* Mariana */}
                            <li className="flex items-center gap-4 p-4 border border-verde rounded-lg">
                                <div className="text-5xl">
                                    <GrDocumentPdf />
                                </div>

                                <div>
                                    <h4 className="font-bold text-2xl">
                                        Etiqueta DR Mariana Dermato
                                    </h4>
                                    <span>
                                        Orientações gerais, com data, hora e local da consulta.
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 text-lg text-zinc-600 ml-auto">
                                    <IoCalendarNumberOutline />
                                    <span>24/11/2026</span>
                                </div>

                                <button
                                    type="button"
                                    className="flex items-center gap-2 p-2 rounded-2xl border border-verde font-semibold transition-all duration-300 hover:bg-verde/80 hover:text-white"
                                    onClick={() => {
                                        limparFormularioDocumento()
                                        setDocumentoSelecionado("ETIQUETA_DR_MARIANA_DERMATO")
                                        setDialogDocumentoSelecionado(true)
                                    }}
                                >
                                    <FaRegEye />
                                    <p>Visualizar</p>
                                </button>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>

            {/* Dialog */}
            <Dialog
                header={documentoSelecionado}
                visible={dialogDocumentoSelecionado}
                className="max-w-[1000px] w-full h-[100%] 2xl:h-[90%]"
                onHide={() => {
                    setDialogDocumentoSelecionado(false)
                }}
            >
                <div className="grid grid-cols-[1fr_400px] gap-10">

                    {/* Formulário */}
                    <div>
                        <form className="flex flex-col gap-3">

                            {/* Hospital do Olho */}
                            {documentoSelecionado === "PROTOCOLO_AGENDAMENTO_HOSPITAL_DO_OLHO" && (
                                <>
                                    <InputTexto
                                        icone={<TiEdit />}
                                        label="Nome do paciente"
                                        id="nomeDoPaciente"
                                        nome="nomeDoPaciente"
                                        valor={nomeDoPaciente}
                                        setValor={setNomeDoPaciente}
                                        placeholder="Digite o nome completo do paciente..."
                                    />

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="dataDeNascimentoDoPaciente" className="font-semibold">
                                            Data de nascimento
                                        </label>

                                        <input
                                            type="text"
                                            id="dataDeNascimentoDoPaciente"
                                            value={dataDeNascimentoDoPaciente}
                                            onChange={(e) => setDataDeNascimentoDoPaciente(formatarData(e.target.value))}
                                            placeholder="DD/MM/AAAA"
                                            maxLength={10}
                                            inputMode="numeric"
                                            className="border border-verde rounded-lg p-2"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="dataDeAgendamento" className="font-semibold">
                                            Data do agendamento
                                        </label>

                                        <input
                                            type="text"
                                            id="dataDeAgendamento"
                                            value={dataDeAgendamento}
                                            onChange={(e) => setDataDeAgendamento(formatarData(e.target.value))}
                                            placeholder="DD/MM/AAAA"
                                            maxLength={10}
                                            inputMode="numeric"
                                            className="border border-verde rounded-lg p-2"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="horaDoAgendamento" className="font-semibold">
                                            Horário do agendamento
                                        </label>

                                        <input
                                            type="time"
                                            id="horaDoAgendamento"
                                            value={horaDoAgendamento}
                                            onChange={(e) => setHoraDoAgendamento(e.target.value)}
                                            className="border border-verde rounded-lg p-2"
                                        />
                                    </div>

                                    <InputTexto
                                        icone={<TiEdit />}
                                        label="Endereço do paciente"
                                        id="enderecoDoPaciente"
                                        nome="enderecoDoPaciente"
                                        valor={enderecoDoPaciente}
                                        setValor={setEnderecoDoPaciente}
                                        placeholder="Digite o endereço completo do paciente..."
                                    />

                                    <InputTexto
                                        icone={<TiEdit />}
                                        label="Agente comunitário de saúde"
                                        id="agenteComunitario"
                                        nome="agenteComunitario"
                                        valor={agenteComunitario}
                                        setValor={setAgenteComunitario}
                                        placeholder="Digite o nome do agente comunitário..."
                                    />
                                </>
                            )}
                            {/* Unidade para Jessika */}
                            {documentoSelecionado === "PREPARO_DOUTORA_JESSIKA_PSIQUIATRA" && (
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="unidadeCliente"
                                    label="Unidade de atendimento"
                                    nome="unidadeCliente"
                                    setValor={setLocalDeAtendimento}
                                    valor={localDeAtendimento}
                                    opcoes={opcoesUnidadesDoCliente}
                                />
                            )}

                            {/* Campos das etiquetas: Hector, Antonely e Adriana */}
                            {documentoExigeDataEHora && (
                                <>
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="unidadeCliente"
                                        label="Local de atendimento"
                                        nome="unidadeCliente"
                                        setValor={setLocalDeAtendimento}
                                        valor={localDeAtendimento}
                                        opcoes={opcoesUnidadesDoCliente}
                                    />

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="dataDaConsulta" className="font-semibold">
                                            Data da consulta
                                        </label>

                                        <input
                                            type="text"
                                            id="dataDaConsulta"
                                            value={dataDaConsulta}
                                            onChange={(e) => setDataDaConsulta(formatarData(e.target.value))}
                                            placeholder="DD/MM/AAAA"
                                            maxLength={10}
                                            inputMode="numeric"
                                            className="border border-verde rounded-lg p-2"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="horarioDaConsulta" className="font-semibold">
                                            Horário da consulta
                                        </label>

                                        <input
                                            type="time"
                                            id="horarioDaConsulta"
                                            value={horarioDaConsulta}
                                            onChange={(e) => setHorarioDaConsulta(e.target.value)}
                                            className="border border-verde rounded-lg p-2"
                                        />
                                    </div>
                                </>
                            )}
                            {
                                documentoSelecionado != "PROTOCOLO_AGENDAMENTO_HOSPITAL_DO_OLHO" && (
                                    <>
                                        {/* Quantidade */}
                                        <InputTexto
                                            label="Quantidade de etiquetas"
                                            id="quantidadeDeEtiquetas"
                                            nome="quantidadeDeEtiquetas"
                                            valor={quantidadeDeEtiquetas}
                                            setValor={setQuantidadeDeEtiquetas}
                                            icone={<BsCardText />}
                                            placeholder="Digite a quantidade de etiquetas..."
                                        />
                                    </>
                                )
                            }

                            {/* Ações */}
                            <div className="flex items-center gap-3 ml-auto mt-3">

                                <button
                                    type="button"
                                    onClick={limparFormularioDocumento}
                                    className="flex items-center gap-2 font-bold rounded-lg border border-red-600 text-red-600 p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-red-600"
                                >
                                    <AiOutlineClear className="text-2xl" />
                                    Limpar
                                </button>

                                <button
                                    type="button"
                                    onClick={salvarDocumento}
                                    className="flex items-center gap-2 font-bold rounded-lg border border-verde p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-verde"
                                >
                                    <HiSaveAs className="text-2xl" />
                                    Salvar
                                </button>

                            </div>
                        </form>
                    </div>

                    {/* Visualização PDF */}
                    <div className="w-full h-[600px] border border-verde rounded-xl overflow-hidden">
    <VisualizadorPDF documento={documentoParaVisualizar} />
</div>
                </div>
            </Dialog>
        </Template>
    )
}
