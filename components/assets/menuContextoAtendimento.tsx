import { FaEdit } from "react-icons/fa"
import {
    MdEventAvailable,
    MdPhone,
    MdHistory,
    MdPrint,
    MdPriorityHigh,
    MdSearch,
    MdClose,
} from "react-icons/md"

interface MenuContextoAtendimentoProps {
    x: number
    y: number
    atendimento: any
    onClose: () => void
}

export default function MenuContextoAtendimento({
    x,
    y,
    atendimento,
    onClose,
}: MenuContextoAtendimentoProps) {

    return (
        <>
            {/* Área invisível para fechar ao clicar fora */}
            <div
                className="fixed inset-0 z-[999]"
                onClick={onClose}
            />

            {/* Menu */}
            <div
                className="fixed z-[1000] w-[250px] bg-zinc-900 border border-zinc-600 shadow-2xl rounded-sm overflow-hidden"
                style={{
                    left: x,
                    top: y,
                }}
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Iniciar agendamento", atendimento)
                        onClose()
                    }}
                >
                    <MdEventAvailable size={20} />
                    Incluir Agendamento
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Alterar agendamento", atendimento)
                        onClose()
                    }}
                >
                    <FaEdit size={20} />
                    Alterar
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Alterar agendamento", atendimento)
                        onClose()
                    }}
                >
                    <FaEdit size={20} />
                    Bloquear
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Alterar agendamento", atendimento)
                        onClose()
                    }}
                >
                    <FaEdit size={20} />
                    Desbloquear
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Registrar contato", atendimento)
                        onClose()
                    }}
                >
                    <MdPhone size={20} />
                    Registrar Contato Telefônico
                </button>

                <div className="h-px bg-zinc-700 my-1" />

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Histórico", atendimento)
                        onClose()
                    }}
                >
                    <MdHistory size={20} />
                    Histórico do Cliente
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Comprovante", atendimento)
                        onClose()
                    }}
                >
                    <MdPrint size={20} />
                    Comprovante de Entrada
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Comprovante", atendimento)
                        onClose()
                    }}
                >
                    <MdPrint size={20} />
                    Comprovante de Agendamento/Autorização
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Comprovante", atendimento)
                        onClose()
                    }}
                >
                    <MdPrint size={20} />
                    Requisição de Exames
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Comprovante", atendimento)
                        onClose()
                    }}
                >
                    <MdPrint size={20} />
                    Consultar CADSUS
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Prioridade", atendimento)
                        onClose()
                    }}
                >
                    <MdPriorityHigh size={20} />
                    Solicitar Prioridade
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Visualizar", atendimento)
                        onClose()
                    }}
                >
                    <MdSearch size={20} />
                    Visualizar
                </button>

                <div className="h-px bg-zinc-700 my-1" />

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-zinc-700"
                    onClick={onClose}
                >
                    <MdClose size={20} />
                    Fechar
                </button>

            </div>
        </>
    )
}