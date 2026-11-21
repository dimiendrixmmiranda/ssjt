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
import { useLayoutEffect, useRef, useState } from "react"
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
    agendamento: any
    onClose: () => void
    onAction: (
        acao: AcaoPaciente,
        agendamento: any,
        novaAba?: Window | null
    ) => void
}

export default function MenuContextoPaciente({
    x,
    y,
    agendamento,
    onClose,
    onAction,
}: MenuContextoPacienteProps) {
    const menuRef = useRef<HTMLDivElement>(null)

    const [posicao, setPosicao] = useState({
        left: x,
        top: y
    })

    useLayoutEffect(() => {
        const menu = menuRef.current

        if (!menu) return

        const margem = 8

        const largura = menu.offsetWidth
        const alturaTela = window.innerHeight
        const larguraTela = window.innerWidth

        // POSIÇÃO HORIZONTAL
        let esquerda = x

        if (esquerda + largura > larguraTela - margem) {
            esquerda = x - largura
        }

        esquerda = Math.max(
            margem,
            Math.min(esquerda, larguraTela - largura - margem)
        )

        // POSIÇÃO VERTICAL
        // Mantém o menu próximo do ponto do clique
        let topo = y

        // Garante que o menu não ultrapasse a parte inferior
        const alturaDisponivel = alturaTela - y - margem

        if (alturaDisponivel < 150) {
            topo = Math.max(margem, alturaTela - 150 - margem)
        }

        setPosicao({
            left: esquerda,
            top: topo
        })

    }, [x, y])

    console.log(agendamento.statusDeAgendamento)

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
                ref={menuRef}
                className="
                    fixed
                    z-[1000]
                    w-[270px]
                    max-h-[calc(100vh-16px)]
                    overflow-y-auto
                    bg-zinc-900
                    border
                    border-zinc-600
                    shadow-2xl
                    rounded-sm
                "
                style={{
                    left: posicao.left,
                    top: posicao.top,
                    maxHeight: `calc(100vh - ${posicao.top}px - 8px)`
                }}
                onClick={(e) => e.stopPropagation()}
                onContextMenu={(e) => e.preventDefault()}
            >

                <button
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700 ${agendamento.statusDeAgendamento === 'AGENDADO' ? 'opacity-30' : ''}`}
                    onClick={() => onAction("agendamento", agendamento)}
                    disabled={agendamento.statusDeAgendamento === 'AGENDADO' ? true : false}
                >
                    <MdEventAvailable size={20} />
                    Incluir Agendamento
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Alterar agendamento", agendamento)
                        onClose()
                    }}
                >
                    <FaEdit size={20} />
                    Alterar
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Alterar agendamento", agendamento)
                        onClose()
                    }}
                >
                    <FaEdit size={20} />
                    Bloquear
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Alterar agendamento", agendamento)
                        onClose()
                    }}
                >
                    <FaEdit size={20} />
                    Desbloquear
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Registrar contato", agendamento)
                        onClose()
                    }}
                >
                    <MdPhone size={20} />
                    Registrar Contato Telefônico
                </button>

                <div className="h-px bg-zinc-700 my-1" />

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Histórico", agendamento)
                        onClose()
                    }}
                >
                    <MdHistory size={20} />
                    Histórico do Cliente
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Comprovante", agendamento)
                        onClose()
                    }}
                >
                    <MdPrint size={20} />
                    Comprovante de Entrada
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Comprovante", agendamento)
                        onClose()
                    }}
                >
                    <MdPrint size={20} />
                    Comprovante de Agendamento
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700"
                    onClick={() => onAction("requisicaoExames", agendamento)}
                >
                    <MdPrint size={20} />
                    Requisição de Encaminhamento
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Comprovante", agendamento)
                        onClose()
                    }}
                >
                    <MdPrint size={20} />
                    Consultar CADSUS
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Prioridade", agendamento)
                        onClose()
                    }}
                >
                    <MdPriorityHigh size={20} />
                    Solicitar Prioridade
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white whitespace-nowrap hover:bg-zinc-700"
                    onClick={() => {
                        console.log("Visualizar", agendamento)
                        onClose()
                    }}
                >
                    <MdSearch size={20} />
                    Visualizar
                </button>

                <div className="h-px bg-zinc-700 my-1" />

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 whitespace-nowrap hover:bg-zinc-700"
                    onClick={onClose}
                >
                    <MdClose size={20} />
                    Fechar
                </button>
            </div>
        </>
    )
}