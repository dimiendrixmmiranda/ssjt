'use client'
import { HiOutlineDocumentReport, HiOutlineFolderDownload, HiSaveAs } from "react-icons/hi";
import Template from "../Template";
import { useState } from "react";
import { GrDocumentPdf } from "react-icons/gr";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import { Local } from "@/generated/prisma/client";
import InputSelect from "@/components/inputs/InputSelect";
import { AiOutlineClear, AiOutlineSelect } from "react-icons/ai";
import { opcoesDeLocais } from "@/constants/dados";
import { useLocais } from "@/hooks/useListaDeLocais";
import { BsCardText } from "react-icons/bs";
import InputTexto from "@/components/inputs/InputTexto";
import dynamic from "next/dynamic"
import { pdf } from "@react-pdf/renderer"
import PreparoDraJessika from "@/components/pdf/documentosPDF/PreparoDraJessika"

const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    { ssr: false }
)


export default function Page() {
    const { locais } = useLocais()

    const opcoesUnidadesDoCliente = opcoesDeLocais(locais)

    const [buscarDocumento, setBuscarDocumento] = useState("")
    const [dialogDocumentoSelecionado, setDialogDocumentoSelecionado] = useState(false)
    const [documentoSelecionado, setDocumentoSelecionado] = useState("")

    // states dos formularios
    const [localDeAtendimento, setLocalDeAtendimento] = useState<string | number | null>(null)
    const [quantidadeDeEtiquetas, setQuantidadeDeEtiquetas] = useState("1")
    console.log(localDeAtendimento)


    const nomeLocalSelecionado = locais.find(
        (local) => String(local.id) === String(localDeAtendimento)
    )?.nome ?? ""

    const limparFormularioDocumento = () => {
        setLocalDeAtendimento(null)
        setQuantidadeDeEtiquetas("1")
    }

    const salvarDocumento = async () => {
        const quantidade = Number(quantidadeDeEtiquetas)

        if (!localDeAtendimento) {
            alert("Selecione a unidade de atendimento.")
            return
        }

        if (!Number.isInteger(quantidade) || quantidade < 1) {
            alert("Informe uma quantidade válida de etiquetas.")
            return
        }

        try {
            const documento = pdf(
                <PreparoDraJessika
                    local={nomeLocalSelecionado}
                    quantidade={quantidade}
                />
            )

            const arquivo = await documento.toBlob()
            const url = URL.createObjectURL(arquivo)

            const link = document.createElement("a")
            link.href = url
            link.download = `preparo-dra-jessika-${quantidade}-etiquetas.pdf`

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            setTimeout(() => URL.revokeObjectURL(url), 1000)
        } catch (erro) {
            console.error("Erro ao gerar documento:", erro)
            alert("Não foi possível gerar o PDF.")
        }
    }



    return (
        <Template>
            <div className="p-4 text-verde-escuro flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center my-auto gap-2 text-verde-escuro">
                        <HiOutlineDocumentReport className="text-5xl" />
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold">Documentos</h3>
                            <p className="-mt-1">Biblioteca de documentos e orientações da Secretaria municipal de Saúde.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-full bg-verde" />
                        <h4 className="text-2xl font-bold">Documentos Recentes</h4>
                    </div>
                    <div>
                        <input className="border border-verde bg-verde/20 text-black p-2 text-lg rounded-lg w-full pl-10" placeholder="Buscar por nome do prestador ou especialidade..." type="search" name="buscarDocumento" id="buscarDocumento" value={buscarDocumento} onChange={(e) => setBuscarDocumento(e.target.value)} />
                    </div>
                    <div>
                        <ul className="flex flex-col gap-3 max-h-[75vh] overflow-y-scroll">
                            <li className="flex items-center gap-4 p-4 border border-verde rounded-lg">
                                <div className="text-5xl">
                                    <GrDocumentPdf />
                                </div>
                                <div>
                                    <h4 className="font-bold text-2xl">Preparo Doutora Jessika Psiquiatra.</h4>
                                    <span>Orientações para para consulta com a Psiquiatra.</span>
                                </div>
                                <div className="flex items-center gap-1 text-lg text-zinc-600 ml-auto">
                                    <IoCalendarNumberOutline />
                                    <span>24/11/2026</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="flex items-center gap-2 p-2 rounded-2xl border border-verde font-semibold transition-all duration-300 hover:bg-verde/80 hover:text-white"
                                        onClick={() => {
                                            setDocumentoSelecionado('PREPARO_DOUTORA_JESSIKA_PSIQUIATRA')
                                            setDialogDocumentoSelecionado(true)
                                        }}
                                    >
                                        <FaRegEye />
                                        <p>Visualizar</p>
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Dialog header={documentoSelecionado} visible={dialogDocumentoSelecionado} className="max-w-[1000px] w-full h-[100%]" onHide={() => { setDialogDocumentoSelecionado(false) }}>
                <div className="grid grid-cols-[1fr_400px] gap-10">
                    <div>
                        <form className="flex flex-col gap-3">
                            <InputSelect
                                icone={<AiOutlineSelect />}
                                id="unidadeCliente"
                                label="Unidade do cliente"
                                nome="unidadeCliente"
                                setValor={setLocalDeAtendimento}
                                valor={localDeAtendimento}
                                opcoes={opcoesUnidadesDoCliente}
                            />
                            <InputTexto
                                label="Quantidade de Etiquetas"
                                id="quantidadeDeEtiquetas"
                                nome="quantidadeDeEtiquetas"
                                valor={quantidadeDeEtiquetas}
                                setValor={setQuantidadeDeEtiquetas}
                                icone={<BsCardText />}
                                placeholder="Digite a quantidade de etiquetas que deseja..."
                            />
                            <div className="flex items-center gap-3 ml-auto mt-3">
                                <button
                                    type="button"
                                    onClick={limparFormularioDocumento}
                                    className="flex items-center gap-2 font-bold rounded-lg border border-red-600 text-red-600 p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-red-600"
                                >
                                    <AiOutlineClear className="text-2xl" />
                                    <p>Limpar</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={salvarDocumento}
                                    className="flex items-center gap-2 font-bold rounded-lg border border-verde p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-verde disabled:opacity-50"
                                >
                                    <HiSaveAs className="text-2xl" />
                                    <p>Salvar</p>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="w-full h-[600px] border border-verde rounded-xl overflow-hidden">
                        <PDFViewer
                            width="100%"
                            height="100%"
                            showToolbar
                        >
                            <PreparoDraJessika
                                local={nomeLocalSelecionado || "SELECIONE A UNIDADE"}
                                quantidade={Math.max(
                                    1,
                                    Number(quantidadeDeEtiquetas) || 1
                                )}
                            />
                        </PDFViewer>
                    </div>
                </div>
            </Dialog>
        </Template>
    )
}