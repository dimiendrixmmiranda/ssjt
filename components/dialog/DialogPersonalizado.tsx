"use client"
        
import { Dialog } from 'primereact/dialog';
        
interface DialogPersonalizadoProps {
    visivel: boolean
    titulo: string
    mensagem?: string
    children?: React.ReactNode

    textoConfirmar?: string
    textoCancelar?: string

    mostrarCancelar?: boolean

    aoConfirmar: () => void
    aoCancelar: () => void
}

export default function DialogPersonalizado({
    visivel,
    titulo,
    mensagem,
    children,
    textoConfirmar = "Confirmar",
    textoCancelar = "Cancelar",
    mostrarCancelar = false,
    aoConfirmar,
    aoCancelar,
}: DialogPersonalizadoProps) {

    const rodape = (
        <div className="flex justify-end gap-3">
            {mostrarCancelar && (
                <button
                    type="button"
                    onClick={aoCancelar}
                    className="border border-gray-400 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-all"
                >
                    {textoCancelar}
                </button>
            )}

            <button
                type="button"
                onClick={aoConfirmar}
                className="bg-verde text-white px-4 py-2 rounded-lg font-bold hover:bg-verde-escuro transition-all"
            >
                {textoConfirmar}
            </button>
        </div>
    )

    return (
        <Dialog
            visible={visivel}
            onHide={aoCancelar}
            header={titulo}
            footer={rodape}
            modal
            draggable={false}
            resizable={false}
            className="w-[90vw] max-w-[450px] bg-red-500"
        >
            <div className="text-gray-700">
                {mensagem && <p>{mensagem}</p>}
                {children}
            </div>
        </Dialog>
    )
}