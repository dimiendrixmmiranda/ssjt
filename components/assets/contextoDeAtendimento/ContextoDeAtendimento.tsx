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

interface MenuContextoPacienteProps {
    x: number
    y: number
    paciente: any
    onClose: () => void
    onAction: (acao: AcaoPaciente, paciente: any) => void
}

export default function MenuContextoPaciente({
    x,
    y,
    paciente,
    onClose,
    onAction,
}: MenuContextoPacienteProps) {

    return (
        <>
            {/* Área invisível para fechar ao clicar fora */}
            <div
                className="fixed inset-0 z-[999]"
                onClick={onClose}
                onContextMenu={(e) => e.preventDefault()}
            />

            {/* Menu */}
            <div
                className="
                    fixed
                    z-[1000]
                    w-[270px]
                    bg-zinc-900
                    border
                    border-zinc-600
                    shadow-2xl
                    rounded-sm
                    overflow-hidden
                "
                style={{
                    left: x,
                    top: y,
                }}
                onClick={(e) => e.stopPropagation()}
                onContextMenu={(e) => e.preventDefault()}
            >

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => onAction("agendamento", paciente)}
                >
                    <MdEventAvailable size={20} />
                    Incluir Agendamento
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Alterar agendamento", paciente)
                        onClose()
                    }}
                >
                    <FaEdit size={20} />
                    Alterar
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Alterar agendamento", paciente)
                        onClose()
                    }}
                >
                    <FaEdit size={20} />
                    Bloquear
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Alterar agendamento", paciente)
                        onClose()
                    }}
                >
                    <FaEdit size={20} />
                    Desbloquear
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Registrar contato", paciente)
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
                        console.log("Histórico", paciente)
                        onClose()
                    }}
                >
                    <MdHistory size={20} />
                    Histórico do Cliente
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Comprovante", paciente)
                        onClose()
                    }}
                >
                    <MdPrint size={20} />
                    Comprovante de Entrada
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Comprovante", paciente)
                        onClose()
                    }}
                >
                    <MdPrint size={20} />
                    Comprovante de Agendamento
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Comprovante", paciente)
                        onClose()
                    }}
                >
                    <MdPrint size={20} />
                    Requisição de Exames
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Comprovante", paciente)
                        onClose()
                    }}
                >
                    <MdPrint size={20} />
                    Consultar CADSUS
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Prioridade", paciente)
                        onClose()
                    }}
                >
                    <MdPriorityHigh size={20} />
                    Solicitar Prioridade
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Visualizar", paciente)
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