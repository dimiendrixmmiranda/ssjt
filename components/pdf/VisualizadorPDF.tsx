'use client'

import { useEffect, useState } from "react"
import { pdf, DocumentProps } from "@react-pdf/renderer"

interface VisualizadorPDFProps {
    documento: React.ReactElement<DocumentProps> | null
}

export default function VisualizadorPDF({ documento }: VisualizadorPDFProps) {
    const [urlPDF, setUrlPDF] = useState("")

    useEffect(() => {
        let urlTemporaria = ""

        if (!documento) {
            setUrlPDF("")
            return
        }

        let cancelado = false

        const gerarPDF = async () => {
            try {
                const arquivo = await pdf(documento).toBlob()

                if (cancelado) return

                urlTemporaria = URL.createObjectURL(arquivo)
                setUrlPDF(urlTemporaria)
            } catch (erro) {
                console.error("Erro ao gerar visualização do PDF:", erro)
            }
        }

        gerarPDF()

        return () => {
            cancelado = true

            if (urlTemporaria) {
                URL.revokeObjectURL(urlTemporaria)
            }
        }
    }, [documento])

    return (
        <div className="w-full h-full">
            {urlPDF ? (
                <iframe
                    src={`${urlPDF}#toolbar=1&navpanes=0`}
                    className="w-full h-full"
                    title="Visualização do documento PDF"
                />
            ) : (
                <div className="flex items-center justify-center h-full">
                    Gerando visualização do PDF...
                </div>
            )}
        </div>
    )
}